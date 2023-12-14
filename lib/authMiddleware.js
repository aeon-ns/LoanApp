// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const constants = require('./constants');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    // @ts-ignore
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT Error: ', err);
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }

        // Set decoded user information in the request object
        req.user = decoded;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }
    if (req.user.role != constants.USERS.ROLES.ADMIN) {
        return res.status(403).json({ error: 'Forbidden - Action not permitted to user' });
    }
    return next();
}

const isUser = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }
    if (!req.user.role) {
        return res.status(403).json({ error: 'Forbidden - Action not permitted to user' });
    }
    return next();
}


module.exports = {
    authenticateToken,
    isAdmin,
    isUser,
};
