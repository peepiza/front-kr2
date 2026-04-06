import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`).then(res => {
        setTitle(res.data.title);
        setCategory(res.data.category);
        setDescription(res.data.description);
        setPrice(res.data.price);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, category, description, price: Number(price) };
    if (id) {
      await api.put(`/products/${id}`, data);
    } else {
      await api.post('/products', data);
    }
    navigate('/products');
  };

  return (
    <div className="card">
      <h2>{id ? 'Редактировать товар' : 'Создать товар'}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} required />
        <input placeholder="Категория" value={category} onChange={e => setCategory(e.target.value)} required />
        <textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" placeholder="Цена" value={price} onChange={e => setPrice(e.target.value)} required />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}

export default ProductForm;