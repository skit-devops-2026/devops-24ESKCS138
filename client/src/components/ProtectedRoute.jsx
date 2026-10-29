import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--green)' }}>
        <p style={{ fontSize: '18px', fontWeight: '500' }}>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{ padding: '80px 7%', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--gray)', margin: '15px 0 25px' }}>
          This page is only accessible to accounts registered as <strong>{requiredRole}</strong>.
          You are currently signed in as a <strong>{user.role}</strong> ({user.email}).
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/products" className="primary-btn">
            Browse Products
          </Link>
          <Link to="/orders" className="secondary-btn">
            My Orders
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
