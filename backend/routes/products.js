const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');
const { products } = require('../utils/tokens');
const { nanoid } = require('nanoid');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', authMiddleware, roleMiddleware(['seller', 'admin']), (req, res) => {
  const { title, category, description, price } = req.body;
  if (!title || !category || !description || price === undefined) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const newProduct = {
    id: nanoid(),
    title,
    category,
    description,
    price: Number(price)
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/:id', authMiddleware, roleMiddleware(['seller', 'admin']), (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const { title, category, description, price } = req.body;
  if (title) product.title = title;
  if (category) product.category = category;
  if (description) product.description = description;
  if (price !== undefined) product.price = Number(price);
  res.json(product);
});

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  products.splice(index, 1);
  res.json({ message: 'Product deleted' });
});

module.exports = router;