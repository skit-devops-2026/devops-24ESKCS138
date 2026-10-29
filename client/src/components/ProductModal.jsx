import React, { useState } from 'react';
import { createOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProductModal({ product, onClose }) {
  const { user } = useAuth();
  const [orderQty, setOrderQty] = useState(1);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!product) return null;

  const handleOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!address.trim()) {
      setErrorMsg('Please enter your delivery address');
      return;
    }

    try {
      setLoading(true);
      const order = await createOrder({
        items: [
          {
            productId: product.id || product._id,
            productName: product.name,
            price: product.price,
            quantity: orderQty,
            unit: product.unit || 'kg',
          },
        ],
        deliveryAddress: address,
        buyerName: user ? user.name : 'Guest Buyer',
        buyerPhone: user?.phone || '',
      });

      setOrderResult(order);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
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
            <span>{product.stock ? `${product.stock} ${product.unit || 'kg'}` : 'In Stock'}</span>
          </div>
        </div>

        {orderResult ? (
          <div>
            <div
              style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '14px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '15px',
              }}
            >
              <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>✓ Order Placed Successfully!</h4>
              <p style={{ fontSize: '13px' }}>
                Order #{orderResult.id || orderResult._id} for {orderQty} {product.unit || 'kg'} (₹{orderResult.totalAmount})
              </p>
              <p style={{ fontSize: '11px', marginTop: '6px', color: '#166534' }}>
                Deliver to: {orderResult.deliveryAddress}
              </p>
            </div>
            <button
              className="primary-btn"
              style={{ width: '100%', padding: '10px' }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrder}>
            {errorMsg && (
              <div
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  marginBottom: '12px',
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
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

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                Delivery Address *
              </label>
              <textarea
                rows="2"
                placeholder="Enter street, city, pin code..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="secondary-btn"
                style={{ flex: 1, padding: '10px' }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
                style={{ flex: 1, padding: '10px' }}
              >
                {loading ? 'Submitting...' : 'Confirm Order'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
