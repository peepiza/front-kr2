const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');
const { users, refreshTokens } = require('../utils/tokens');
const bcrypt = require('bcrypt');

const router = express.Router();

router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/', (req, res) => {
  const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
  res.json(safeUsers);
});

router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

router.put('/:id', async (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { email, first_name, last_name, role, password } = req.body;
  if (email) user.email = email;
  if (first_name) user.first_name = first_name;
  if (last_name) user.last_name = last_name;
  if (role && ['user', 'seller', 'admin'].includes(role)) user.role = role;
  if (password) user.passwordHash = await bcrypt.hash(password, 10);
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  const deleted = users.splice(index, 1)[0];
  
  for (let token of refreshTokens) {
    try {
      const jwt = require('jsonwebtoken');
      const payload = jwt.verify(token, process.env.REFRESH_SECRET || 'refresh_secret');
      if (payload.sub === deleted.id) refreshTokens.delete(token);
    } catch (e) {}
  }
  res.json({ message: 'User blocked/deleted' });
});

module.exports = router;