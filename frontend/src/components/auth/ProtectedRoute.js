// src/components/Auth/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const expiry = localStorage.getItem('expiry');
  const location = useLocation();

  useEffect(() => {
    // Prevent navigating back after logout
    const preventBack = () => {
      if (!localStorage.getItem('token')) {
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBack);

    return () => {
      window.removeEventListener('popstate', preventBack);
    };
    
  }, []);

  if (!token) {
    console.warn('Access denied: No token');
    return <Navigate to="/" replace />;
  }

  if (expiry && Date.now() > Number(expiry)) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
