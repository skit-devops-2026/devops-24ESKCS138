import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, getFarmerOrders, updateOrderStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { user, isFarmer } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const apiCall = isFarmer ? getFarmerOrders : getMyOrders;

    apiCall()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Could not fetch orders:', err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [isFarmer]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setStatusMsg(`✓ Order #${orderId} updated to ${newStatus}`);
      fetchOrders();
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: '#fef3c7', color: '#b45309', label: 'Pending' },
      confirmed: { bg: '#dbeafe', color: '#1d4ed8', label: 'Confirmed' },
      shipped: { bg: '#e0e7ff', color: '#4338ca', label: 'Shipped' },
      delivered: { bg: '#dcfce7', color: '#15803d', label: 'Delivered' },
      cancelled: { bg: '#fee2e2', color: '#b91c1c', label: 'Cancelled' },
    };
    const s = map[status?.toLowerCase()] || map.pending;
    return (
      <span
        style={{
          background: s.bg,
          color: s.color,
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'capitalize',
        }}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ padding: '40px 7%', minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '26px' }}>{isFarmer ? 'Incoming Orders Management' : 'My Orders & Deliveries'}</h1>
          <p style={{ color: 'var(--gray)', fontSize: '13px' }}>
            {isFarmer
              ? 'Review orders placed by buyers and update their fulfillment status.'
              : 'Track the status and progress of your direct farm produce orders.'}
          </p>
        </div>

        <button
          onClick={fetchOrders}
          style={{
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '8px 14px',
            fontSize: '13px',
          }}
        >
          🔄 Refresh Orders
        </button>
      </div>

      {statusMsg && (
        <div
          style={{
            background: '#dcfce7',
            color: '#15803d',
            padding: '12px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          {statusMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--green)' }}>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>Loading orders from Kisan Market API...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="no-products-msg">
          <p>No orders recorded yet.</p>
          <Link to="/products" className="primary-btn" style={{ marginTop: '15px' }}>
            Explore Fresh Produce
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {orders.map((order) => {
            const orderId = order.id || order._id;
            return (
              <div
                key={orderId}
                style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f3f4f6',
                    paddingBottom: '12px',
                    marginBottom: '15px',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '15px' }}>Order #{orderId}</strong>
                    <span style={{ color: 'var(--gray)', fontSize: '12px', marginLeft: '12px' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {getStatusBadge(order.status)}

                    {/* Farmers can change status */}
                    {isFarmer && (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(orderId, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '12px',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.2fr',
                    gap: '20px',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '8px' }}>
                      Items Ordered
                    </h4>
                    {order.items &&
                      order.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '13px',
                            marginBottom: '4px',
                          }}
                        >
                          <span>
                            🌾 <strong>{item.productName}</strong> × {item.quantity} {item.unit || 'kg'}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                  </div>

                  <div style={{ borderLeft: '1px solid #f3f4f6', paddingLeft: '20px' }}>
                    <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--gray)' }}>Customer: </span>
                      <strong>{order.buyerName}</strong>
                    </div>
                    {order.deliveryAddress && (
                      <div style={{ marginBottom: '8px', fontSize: '12px', color: '#4b5563' }}>
                        <span style={{ color: 'var(--gray)' }}>Address: </span>
                        {order.deliveryAddress}
                      </div>
                    )}
                    <div style={{ marginTop: '12px', fontSize: '16px', fontWeight: '700', color: 'var(--dark-green)' }}>
                      Total: ₹{order.totalAmount}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
