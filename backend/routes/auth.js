const express = require('express');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, refreshTokens, users } = require('../utils/tokens');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: String(users.length + 1),
    email,
    first_name,
    last_name,
    passwordHash,
    role: 'user'
  };
  users.push(newUser);
  res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.add(refreshToken);
  res.json({ accessToken, refreshToken });
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  if (!refreshTokens.has(refreshToken)) return res.status(401).json({ error: 'Invalid refresh token' });

  try {
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refresh_secret');
    const user = users.find(u => u.id === payload.sub);
    if (!user) return res.status(401).json({ error: 'User not found' });

    refreshTokens.delete(refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.add(newRefreshToken);
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role
  });
});

module.exports = router;