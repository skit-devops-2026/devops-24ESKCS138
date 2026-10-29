import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">🌾</span>
        <span>
          Kisan<span className="logo-highlight">Market</span>
        </span>
      </Link>

      <nav className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>
        <Link
          to="/products"
          className={location.pathname === '/products' ? 'active' : ''}
        >
          Products
        </Link>
        <a href="/#market">Market Prices</a>

        {/* Show Farmer Dashboard for farmers or unauthenticated guests */}
        {(!isAuthenticated || user?.role === 'farmer') && (
          <Link
            to="/farmer/dashboard"
            className={location.pathname.startsWith('/farmer') ? 'active' : ''}
          >
            Farmer Dashboard
          </Link>
        )}

        {/* Show My Orders link */}
        <Link
          to="/orders"
          className={location.pathname === '/orders' ? 'active' : ''}
        >
          Orders
        </Link>

        <a href="/#about">About Us</a>
      </nav>

      <div className="nav-buttons">
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                background: 'var(--light-green)',
                color: 'var(--green)',
                padding: '5px 12px',
                borderRadius: '20px',
              }}
            >
              {user.role === 'farmer' ? '👨‍🌾' : '🛒'} {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              style={{
                border: '1px solid #d1d5db',
                background: 'transparent',
                color: '#4b5563',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
