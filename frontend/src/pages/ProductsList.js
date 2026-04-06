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
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem',
        alignItems: 'stretch'
      }}>
        {products.map(product => (
          <div key={product.id} className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: '100%'
          }}>
            {product.imageUrl && (
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '12px', 
                  marginBottom: '1rem' 
                }} 
              />
            )}
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{product.title}</h3>
            <p style={{ margin: '0.25rem 0' }}>Категория: {product.category}</p>
            <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>Цена: {product.price} ₽</p>
            
            {/* Блок с кнопками, прижат к низу */}
            <div style={{ 
              marginTop: 'auto', 
              display: 'flex', 
              gap: '0.75rem', 
              marginTop: '1rem',
              flexWrap: 'wrap'
            }}>
              <Link to={`/products/${product.id}`} style={{ 
                background: 'linear-gradient(135deg, #6a0dad, #9b4dff)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '40px',
                textDecoration: 'none',
                fontSize: '0.85rem'
              }}>Подробнее</Link>
              
              {(user?.role === 'seller' || user?.role === 'admin') && (
                <Link to={`/products/edit/${product.id}`} style={{ 
                  background: '#2a2a35',
                  color: '#c084fc',
                  padding: '6px 12px',
                  borderRadius: '40px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  border: '1px solid #9b4dff'
                }}>Редактировать</Link>
              )}
              
              {user?.role === 'admin' && (
                <button 
                  onClick={() => handleDelete(product.id)} 
                  style={{
                    background: 'linear-gradient(135deg, #8b0000, #c0392b)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Удалить
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsList;