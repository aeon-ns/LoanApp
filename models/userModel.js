
const db = require('../db');
const bcrypt = require('bcrypt');

const findUserByUsername = async (username) => {
  return db('users').where('username', username).first();
};

const createUser = async (userData) => {
  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  return db('users').insert(userData);
};

module.exports = {
  findUserByUsername,
  createUser,
};
