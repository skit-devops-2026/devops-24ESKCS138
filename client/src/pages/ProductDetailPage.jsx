import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderQty, setOrderQty] = useState(1);
  const [orderNotice, setOrderNotice] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getProductById(id)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const fallback = MOCK_PRODUCTS.find((p) => p.id === id);
          setProduct(fallback || null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--green)' }}>
        <p style={{ fontSize: '18px', fontWeight: '500' }}>Loading produce details...</p>
      </div>
    );
  }

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

  const handleOrder = (e) => {
    e.preventDefault();
    setOrderNotice(`✓ Order of ${orderQty} ${product.unit || 'kg'} of ${product.name} submitted! (Total: ₹${orderQty * product.price})`);
  };

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
              <strong>Farmer:</strong> {product.farmer || 'Verified Farmer'}
            </p>
            <p style={{ marginBottom: '6px' }}>
              <strong>Origin:</strong> {product.location || 'Direct Farm'}
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Available:</strong> {product.stock || 10} {product.unit || 'kg'} in stock
            </p>
          </div>

          {orderNotice ? (
            <div
              style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
              }}
            >
              {orderNotice}
            </div>
          ) : (
            <form onSubmit={handleOrder}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '15px',
                }}
              >
                <label style={{ fontSize: '13px', fontWeight: '500' }}>
                  Quantity ({product.unit || 'kg'}):
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 100}
                  value={orderQty}
                  onChange={(e) => setOrderQty(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: '80px',
                    padding: '6px 10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                  }}
                />
                <span style={{ fontSize: '14px', marginLeft: 'auto', fontWeight: '600' }}>
                  Total: ₹{orderQty * product.price}
                </span>
              </div>

              <button
                type="submit"
                className="primary-btn"
                style={{ width: '100%', padding: '14px' }}
              >
                Place Direct Order
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
