import React from 'react';
import { MARKET_PRICES } from '../data/mockProducts';

export default function MarketPrices() {
  return (
    <section className="market-section" id="market">
      <div className="market-content">
        <span>MARKET INSIGHTS</span>
        <h2>Know Today's Market Prices</h2>
        <p>
          Stay informed about agricultural mandi prices across key hubs and make
          better buying and selling decisions without relying on middlemen.
        </p>

        <a href="#market" className="primary-btn">
          View All Mandi Rates →
        </a>
      </div>

      <div className="price-table">
        <div className="price-header">
          <span>Crop</span>
          <span>Market</span>
          <span>Price</span>
        </div>

        {MARKET_PRICES.map((item, idx) => (
          <div className="price-row" key={idx}>
            <span>{item.crop}</span>
            <span>{item.market}</span>
            <strong>{item.price}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
