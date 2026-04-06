import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Удалить товар?')) {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <h1>Товары Monster High</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {products.map(product => (
          <div key={product.id} className="card">
            <h3>{product.title}</h3>
            <p>Категория: {product.category}</p>
            <p>Цена: {product.price} ₽</p>
            <Link to={`/products/${product.id}`}>Подробнее</Link>
            {(user?.role === 'seller' || user?.role === 'admin') && (
              <Link to={`/products/edit/${product.id}`} style={{ marginLeft: '1rem' }}>Редактировать</Link>
            )}
            {user?.role === 'admin' && (
              <button className="danger" onClick={() => handleDelete(product.id)} style={{ marginLeft: '1rem' }}>Удалить</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsList;