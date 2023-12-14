// models/RepaymentModel.js
const db = require('../db');

const createRepayment = async (loanId, amount, dueDate) => {
    return db('repayments').insert({
        loan_id: loanId,
        amount: amount,
        state: 'PENDING',
        due_date: dueDate,
    });
};

const getRepaymentsByLoanId = async (loanId) => {
    return db('repayments').where('loan_id', loanId);
};

const updateRepaymentStatusToPaid = async (repaymentId) => {
    return db('repayments').where('id', repaymentId).update({ state: 'PAID' }).returning('*');
};

const updateRepaymentAmount = async (repaymentId, amount) => {
    return db('repayments').where('id', repaymentId).update({ amount }).returning('*');
};

module.exports = {
    createRepayment,
    getRepaymentsByLoanId,
    updateRepaymentStatusToPaid,
    updateRepaymentAmount,
};
