// routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const loanService = require('../services/loanService');
const Joi = require('joi');
const isAdmin = require('../lib/authMiddleware').isAdmin;
const isUser = require('../lib/authMiddleware').isUser;

const loanValidation = Joi.object({
    amount: Joi.number().positive().required(),
    term: Joi.number().positive().integer().required(),
});

// API to get all loans of a user
router.get('/', async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.userId;
        const userLoans = await loanService.getLoansByUserId(userId);
        res.json(userLoans);
    } catch (error) {
        console.error('Error getting user loans:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API to create loan
router.post('/', async (req, res) => {
    try {
        // Validate the request payload
        const { error, value } = loanValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Create a loan using the validated data and userId from req.user
        // @ts-ignore
        const loan = await loanService.createLoan(req.user.userId, value);
        res.status(201).json(loan);
    } catch (error) {
        console.error('Error creating loan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const loanApprovalValidation = Joi.object({
    loanId: Joi.number().positive().integer().required(),
});
// API to approve loan
router.post('/approve', isAdmin, async (req, res) => {
    try {
        // validate
        const { error, value } = loanApprovalValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        // Update loan status
        const updatedLoan = await loanService.approveLoan(value.loanId);
        res.json(updatedLoan);
    } catch (error) {
        console.error('Error approving loan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const repaymentValidation = Joi.object({
    loanId: Joi.number().positive().integer().required(),
    amount: Joi.number().positive().required(),
});
// API to repay loan
router.post('/repayment', isUser, async (req, res) => {
    try {
        const { error, value } = repaymentValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // @ts-ignore
        const result = await loanService.addRepayment(value.loanId, value.amount, req.user.userId);
        res.json(result);
    } catch (error) {
        console.error('Error adding repayment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
