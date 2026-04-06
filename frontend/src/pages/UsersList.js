import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
  }, []);

  const handleBlock = async (id) => {
    if (window.confirm('Заблокировать пользователя?')) {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div>
      <h1>Управление пользователями</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Email</th><th>Имя</th><th>Фамилия</th><th>Роль</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td><td>{user.email}</td><td>{user.first_name}</td><td>{user.last_name}</td><td>{user.role}</td>
              <td>
                <Link to={`/users/${user.id}/edit`}>Редактировать</Link>
                <button className="danger" onClick={() => handleBlock(user.id)} style={{ marginLeft: '0.5rem' }}>Заблокировать</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;