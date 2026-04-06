import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductsList from './pages/ProductsList';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';
import UsersList from './pages/UsersList';
import UserForm from './pages/UserForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/products/create" element={<RoleRoute allowedRoles={['seller','admin']}><ProductForm /></RoleRoute>} />
            <Route path="/products/edit/:id" element={<RoleRoute allowedRoles={['seller','admin']}><ProductForm /></RoleRoute>} />
            <Route path="/users" element={<RoleRoute allowedRoles={['admin']}><UsersList /></RoleRoute>} />
            <Route path="/users/:id/edit" element={<RoleRoute allowedRoles={['admin']}><UserForm /></RoleRoute>} />
            <Route path="/" element={<Navigate to="/products" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;