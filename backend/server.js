require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const { initAdminUser, initProducts } = require('./utils/tokens'); // один раз

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Инициализация данных при старте
initAdminUser();
initProducts();

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});