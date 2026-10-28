import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon">🌾</span>
            <span>
              Kisan<span className="logo-highlight">Market</span>
            </span>
          </div>
          <p>
            Connecting farmers and buyers through simple technology for a more
            transparent and profitable agricultural marketplace.
          </p>
        </div>

        <div className="footer-column">
          <h3>Marketplace</h3>
          <Link to="/products">Products</Link>
          <a href="/#categories">Categories</a>
          <a href="/#market">Market Prices</a>
          <Link to="/farmer/dashboard">Farmers Hub</Link>
        </div>

        <div className="footer-column">
          <h3>Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/farmer/dashboard">My Dashboard</Link>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <p>📧 support@kisanmarket.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Kisan Market. All Rights Reserved.</p>
        <p>Smart Agriculture Marketplace • MERN Full-Stack Project</p>
      </div>
    </footer>
  );
}
