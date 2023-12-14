
const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        await userService.registerUser(userData);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await userService.loginUser(username, password);
        res.json({ message: 'Login successful', user: result.user, token: result.token });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;
