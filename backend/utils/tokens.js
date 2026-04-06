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

function initProducts() {
  if (products.length === 0) {
    products.push(
      {
        id: '1',
        title: 'Кукла Monster High Дракулаура',
        category: 'Куклы',
        description: 'Дракулаура – дочь графа Дракулы. Стильная, с розовыми и чёрными волосами. В комплекте: кукла, одежда, аксессуары.',
        price: 2990,
        imageUrl: '/images/1.png'
      },
      {
        id: '2',
        title: 'Кукла Monster High Фрэнки Штейн',
        category: 'Куклы',
        description: 'Фрэнки – дочь Франкенштейна. Яркие чёрно-белые волосы, зелёная кожа, стильные аксессуары.',
        price: 3190,
        imageUrl: '/images/2.png'
      },
      {
        id: '3',
        title: 'Кукла Monster High Клодин Вульф',
        category: 'Куклы',
        description: 'Клодин – дочь оборотня. Пушистые ушки, синие волосы, модный образ.',
        price: 2890,
        imageUrl: '/images/3.png'
      }
    );
    console.log('3 example products added');
  }
}

module.exports = {
  users,
  products,
  refreshTokens,
  generateAccessToken,
  generateRefreshToken,
  initAdminUser,
  initProducts   
};