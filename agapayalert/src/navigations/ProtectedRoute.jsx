import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, initialAuthCheck } = useSelector((state) => state.auth);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const adminRoles = ['police_officer', 'police_admin', 'city_admin', 'super_admin'];

  // Debugging: Log the authentication state and user object
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);

  if (initialAuthCheck) {
    // Show a loading indicator or return null while the initial authentication check is in progress
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated');
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (isAdminRoute && user?.roles?.includes('user')) {
    console.log('User Authenticated: ', user);
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (!isAdminRoute && adminRoles.some(role => user?.roles?.includes(role))) {
    console.log('Admin authenticated: ', user);
    return <Navigate to="/admin/dashboard" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;