// models/LoanModel.js
const constants = require('../lib/constants');
const db = require('../db');

const createLoan = async (userId, loanData) => {
	loanData.state = constants.STATES.PENDING;
	const [loanId] = await db('loans').insert({ ...loanData, user_id: userId })
	loanData.id = loanId;
	return loanData;
};

const getLoansByUserId = async (userId) => {
	return db('loans').where('user_id', userId);
};

const getLoanById = async (loanId) => {
	return db('loans').where('id', loanId).first();
};

const approveLoan = async (loanId) => {
	return db('loans').where('id', loanId).update({ state: 'APPROVED' });
};

const updateLoanStatusToPaid = async (loanId) => {
	return db('loans').where('id', loanId).update({ state: 'PAID' });
};

module.exports = {
	createLoan,
	getLoansByUserId,
	getLoanById,
	approveLoan,
	updateLoanStatusToPaid,
};
