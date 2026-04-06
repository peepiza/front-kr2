import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ email, first_name, last_name, password });
      navigate('/login');
    } catch (err) {
      setError('Ошибка регистрации. Возможно, email уже занят.');
    }
  };

  return (
    <div className="card">
      <h2>Регистрация</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Имя" value={first_name} onChange={e => setFirstName(e.target.value)} required />
        <input placeholder="Фамилия" value={last_name} onChange={e => setLastName(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
}

export default Register;