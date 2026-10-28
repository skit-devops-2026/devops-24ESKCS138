import React from 'react';

export default function ProductCard({ product, onViewProduct }) {
  return (
    <div className="product-card">
      <div className="product-image">{product.icon || '🌾'}</div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-bottom">
          <strong>
            ₹{product.price} / {product.unit || 'kg'}
          </strong>
          <button type="button" onClick={() => onViewProduct(product)}>
            View Product
          </button>
        </div>
      </div>
    </div>
  );
}
