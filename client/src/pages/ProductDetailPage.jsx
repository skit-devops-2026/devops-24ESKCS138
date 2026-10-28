import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--gray)', margin: '12px 0 24px' }}>
          We could not find the product you were looking for.
        </p>
        <Link to="/products" className="primary-btn">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 7%', maxWidth: '900px', margin: '0 auto' }}>
      <Link
        to="/products"
        style={{
          display: 'inline-block',
          marginBottom: '20px',
          color: 'var(--green)',
          fontWeight: '500',
        }}
      >
        ← Back to all products
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '40px',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '40px',
        }}
      >
        <div
          style={{
            background: 'var(--light-green)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '110px',
            minHeight: '260px',
          }}
        >
          {product.icon || '🌾'}
        </div>

        <div>
          <span className="product-category">{product.category}</span>
          <h1 style={{ fontSize: '28px', margin: '8px 0 12px' }}>
            {product.name}
          </h1>
          <p
            style={{
              color: 'var(--gray)',
              fontSize: '14px',
              lineHeight: '1.7',
              marginBottom: '20px',
            }}
          >
            {product.description}
          </p>

          <div
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--dark-green)',
              marginBottom: '15px',
            }}
          >
            ₹{product.price}{' '}
            <span style={{ fontSize: '15px', fontWeight: '400', color: 'var(--gray)' }}>
              / {product.unit || 'kg'}
            </span>
          </div>

          <div
            style={{
              borderTop: '1px solid #f0f0f0',
              paddingTop: '15px',
              fontSize: '13px',
              color: '#4b5563',
            }}
          >
            <p style={{ marginBottom: '6px' }}>
              <strong>Farmer:</strong> {product.farmer}
            </p>
            <p style={{ marginBottom: '6px' }}>
              <strong>Origin:</strong> {product.location}
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Available:</strong> {product.stock} {product.unit || 'kg'} in stock
            </p>
          </div>

          <button
            className="primary-btn"
            style={{ width: '100%', padding: '14px' }}
            onClick={() => alert(`Simulated order for ${product.name} at ₹${product.price}`)}
          >
            Place Direct Order
          </button>
        </div>
      </div>
    </div>
  );
}
