// services/loanService.js
const LoanModel = require('../models/loanModel');
const RepaymentModel = require('../models/repaymentModel');

const createLoan = async (userId, loanData) => {
	const loan = await LoanModel.createLoan(userId, loanData);
	const { term, amount } = loanData;
	const weeklyRepaymentAmount = amount / term;

	const repaymentDates = [];
	const startDate = new Date();
	for (let i = 1; i <= term; i++) {
		const repaymentDate = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
		repaymentDates.push(repaymentDate.toISOString().split('T')[0]);
	}

	const repayments = repaymentDates.map(async (repaymentDate) => {
		return await RepaymentModel.createRepayment(loan.id, weeklyRepaymentAmount, repaymentDate);
	});

	await Promise.all(repayments);
	return loan;
};

const approveLoan = async (loanId) => {
	// Approve loan
	await LoanModel.approveLoan(loanId);
	// Return updated loan
	return await LoanModel.getLoanById(loanId);
};

const getLoansByUserId = async (userId) => {
	return LoanModel.getLoansByUserId(userId);
};

const validateLoanOwnership = async (loanId, userId) => {
	const loan = await LoanModel.getLoanById(loanId);

	if (!loan) {
		throw new Error('Loan not found');
	}

	if (loan.user_id !== userId) {
		throw new Error('Unauthorized - Loan does not belong to the requesting user');
	}
};

const addRepayment = async (loanId, amount, userId) => {
	await validateLoanOwnership(loanId, userId);

	const repayments = await RepaymentModel.getRepaymentsByLoanId(loanId);
	const unpaidRepayments = repayments.filter((repayment) => repayment.state !== 'PAID');

	if (unpaidRepayments.length === 0) {
		throw new Error('All repayments for this loan have already been paid');
	}

	let remainingAmount = amount;

	for (const repayment of unpaidRepayments) {
		if (remainingAmount <= 0) {
			break;
		}

		const currentRepaymentAmount = repayment.amount;
		const paidAmount = Math.min(remainingAmount, currentRepaymentAmount);

		if (paidAmount === currentRepaymentAmount) {
			// Mark the repayment as 'PAID' if the full amount is paid
			await RepaymentModel.updateRepaymentStatusToPaid(repayment.id);
		} else {
			// Update the amount for the next possible repayment
			await RepaymentModel.updateRepaymentAmount(repayment.id, currentRepaymentAmount - paidAmount);
		}

		remainingAmount -= paidAmount;
	}

	// Check if all scheduled repayments are 'PAID'
	const allPaid = repayments.every((repayment) => repayment.state === 'PAID');

	// If all repayments are 'PAID', update the loan status to 'PAID'
	if (allPaid) {
		await LoanModel.updateLoanStatusToPaid(loanId);
	}

	return { message: 'Repayment(s) added successfully' };
};

module.exports = {
	createLoan,
	approveLoan,
	getLoansByUserId,
	addRepayment,
};
