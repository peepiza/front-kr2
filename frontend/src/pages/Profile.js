import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user } = useAuth();
  if (!user) return <div>Не авторизован</div>;
  return (
    <div className="card">
      <h2>Мой профиль</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Имя:</strong> {user.first_name}</p>
      <p><strong>Фамилия:</strong> {user.last_name}</p>
      <p><strong>Роль:</strong> {user.role}</p>
    </div>
  );
}

export default Profile;