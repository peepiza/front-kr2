import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Загрузка...</div>;
  if (!user) return <Navigate to="/login" />;
  return allowedRoles.includes(user.role) ? children : <Navigate to="/products" />;
}

export default RoleRoute;