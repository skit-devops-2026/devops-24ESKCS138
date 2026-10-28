import React from 'react';
import { Link } from 'react-router-dom';

export default function FarmerSection() {
  return (
    <section className="farmer-section" id="farmers">
      <div className="farmer-content">
        <span>FOR FARMERS</span>
        <h2>Sell Your Products Directly to Buyers</h2>
        <p>
          Join Kisan Market and showcase your agricultural produce to a wider
          customer base across India. Set fair prices, track your inventory, and
          receive direct orders.
        </p>

        <Link to="/register" className="farmer-btn">
          Start Selling Today →
        </Link>
      </div>
    </section>
  );
}
