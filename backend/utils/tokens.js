const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

const users = [];
const products = [];
const refreshTokens = new Set();

function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
}

async function initAdminUser() {
  if (users.length === 0) {
    const adminPassword = await bcrypt.hash('admin', 10);
    users.push({
      id: '1',
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      passwordHash: adminPassword,
      role: 'admin'
    });
    console.log('Admin user created: admin@example.com / admin');
  }
}

module.exports = {
  users,
  products,
  refreshTokens,
  generateAccessToken,
  generateRefreshToken,
  initAdminUser
};