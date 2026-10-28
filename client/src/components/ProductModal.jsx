import React, { useState } from 'react';

export default function ProductModal({ product, onClose }) {
  const [orderQty, setOrderQty] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!product) return null;

  const handleOrder = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <div style={{ fontSize: '65px' }}>{product.icon || '🌾'}</div>
          <span className="product-category">{product.category}</span>
          <h2 style={{ fontSize: '22px', margin: '6px 0' }}>{product.name}</h2>
          <p style={{ color: 'var(--gray)', fontSize: '13px' }}>
            {product.description}
          </p>
        </div>

        <div
          style={{
            background: 'var(--light-green)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '18px',
            fontSize: '13px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <span>Price:</span>
            <strong style={{ color: 'var(--dark-green)' }}>
              ₹{product.price} / {product.unit || 'kg'}
            </strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <span>Farmer:</span>
            <span>{product.farmer || 'Verified Farmer'}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <span>Mandi / Origin:</span>
            <span>{product.location || 'Direct Farm'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Available Stock:</span>
            <span>{product.stock ? `${product.stock} ${product.unit}` : 'In Stock'}</span>
          </div>
        </div>

        {orderPlaced ? (
          <div
            style={{
              background: '#dcfce7',
              color: '#15803d',
              padding: '12px',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '14px',
            }}
          >
            ✓ Order request simulated successfully! (Connected to DB in M4/M6)
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

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="secondary-btn"
                style={{ flex: 1, padding: '10px' }}
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="primary-btn"
                style={{ flex: 1, padding: '10px' }}
              >
                Place Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
