import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/users/${id}`).then(res => {
        setEmail(res.data.email);
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
        setRole(res.data.role);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, first_name, last_name, role };
    if (password) data.password = password;
    await api.put(`/users/${id}`, data);
    navigate('/users');
  };

  return (
    <div className="card">
      <h2>Редактировать пользователя</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Имя" value={first_name} onChange={e => setFirstName(e.target.value)} required />
        <input placeholder="Фамилия" value={last_name} onChange={e => setLastName(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">Пользователь</option>
          <option value="seller">Продавец</option>
          <option value="admin">Администратор</option>
        </select>
        <input type="password" placeholder="Новый пароль (оставьте пустым, чтобы не менять)" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}

export default UserForm;