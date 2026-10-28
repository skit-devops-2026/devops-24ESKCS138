import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

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
        <Link
          to="/farmer/dashboard"
          className={location.pathname.startsWith('/farmer') ? 'active' : ''}
        >
          Farmer Dashboard
        </Link>
        <a href="/#about">About Us</a>
      </nav>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>
        <Link to="/register" className="register-btn">
          Register
        </Link>
      </div>
    </header>
  );
}
