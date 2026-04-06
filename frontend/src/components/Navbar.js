import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/products">Товары</Link>
      {user && <Link to="/profile">Профиль</Link>}
      {user?.role === 'admin' && <Link to="/users">Пользователи</Link>}
      {(user?.role === 'seller' || user?.role === 'admin') && <Link to="/products/create">Создать товар</Link>}
      {!user ? (
        <>
          <Link to="/login">Вход</Link>
          <Link to="/register">Регистрация</Link>
        </>
      ) : (
        <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Выйти</button>
      )}
    </nav>
  );
}

export default Navbar;