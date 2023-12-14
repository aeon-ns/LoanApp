
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
    // Check if the username is already taken
    const existingUser = await userModel.findUserByUsername(userData.username);
    if (existingUser) {
        throw new Error('Username already taken');
    }

    // Create a new user with a hashed password
    const result = await userModel.createUser(userData);
    return result;
};

const loginUser = async (username, password) => {
    const user = await userModel.findUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid username or password');
    }

    // Generate JWT token
    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        },
        token,
    };
};

const generateToken = (user) => {
    const payload = {
        userId: user.id,
        username: user.username,
        role: user.role,
    };

    const options = {
        expiresIn: '1h', // Token expiration time
    };

    // @ts-ignore
    return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = {
    registerUser,
    loginUser,
};
