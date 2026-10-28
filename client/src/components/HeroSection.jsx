import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-tag">🌱 Empowering Indian Farmers</span>

        <h1>
          Fresh From The <span>Farm</span> To Your Door
        </h1>

        <p>
          Kisan Market connects farmers directly with buyers, making
          agricultural products easier to discover, purchase, and sell at fair
          market prices.
        </p>

        <div className="hero-buttons">
          <Link to="/products" className="primary-btn">
            Explore Products →
          </Link>
          <Link to="/register" className="secondary-btn">
            Join as Farmer
          </Link>
        </div>
      </div>

      <div className="hero-image">
        <div className="hero-card">
          <div className="farmer-icon">🌾</div>
          <h3>Support Local Farmers</h3>
          <p>Buy directly from trusted farmers without middlemen</p>
          <div className="hero-stat">
            <strong>100%</strong>
            <span>Fresh Farm Products</span>
          </div>
        </div>
      </div>
    </section>
  );
}
