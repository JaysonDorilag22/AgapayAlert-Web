import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (isAdminRoute && user?.roles?.includes('user')) {
    console.log(user);
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;