const express = require('express');
const bodyParser = require('body-parser');

// Hardcoded secret for now, ideally should be set in env
process.env.JWT_SECRET = 'mysecretkey';

const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');

const authenticateToken = require('./lib/authMiddleware').authenticateToken;

const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the loan routes
app.get('/', (req, res, next) => res.send('OK'));
app.use('/users', userRoutes);
// Apply the authentication middleware to /loans route
app.use('/loans', authenticateToken, loanRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;