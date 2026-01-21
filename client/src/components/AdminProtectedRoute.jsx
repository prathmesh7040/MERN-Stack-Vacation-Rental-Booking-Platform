import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  // Check the flag we set in localStorage during login
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  // If authenticated, show the child component (the dashboard).
  // Otherwise, redirect to the admin login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminProtectedRoute;