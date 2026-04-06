import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="card">
      <h2>{product.title}</h2>
      <p><strong>Категория:</strong> {product.category}</p>
      <p><strong>Описание:</strong> {product.description}</p>
      <p><strong>Цена:</strong> {product.price} ₽</p>
      <Link to="/products">Назад к списку</Link>
    </div>
  );
}

export default ProductDetail;