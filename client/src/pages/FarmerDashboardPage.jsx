import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, createProduct, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function FarmerDashboardPage() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    stock: '100',
    description: '',
    farmer: user?.name || 'Verified Farmer',
    location: user?.location || 'Jaipur Mandi',
  });

  // Load listings on mount
  const loadListings = () => {
    setLoading(true);
    getProducts()
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('API error, using fallback:', err.message);
        setListings(MOCK_PRODUCTS);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    try {
      const created = await createProduct(
        {
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          unit: formData.unit,
          stock: Number(formData.stock) || 50,
          description: formData.description,
          farmer: user?.name || formData.farmer,
          location: user?.location || formData.location,
        },
        token
      );

      setStatusMsg(`✓ "${created.name}" published successfully!`);
      setShowAddModal(false);
      setFormData({
        name: '',
        category: 'Vegetables',
        price: '',
        unit: 'kg',
        stock: '100',
        description: '',
        farmer: 'Logged In Farmer',
        location: 'Jaipur Mandi',
      });
      loadListings();

      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(`Error creating product: ${err.message}`);
    }
  };

  const handleDelete = async (id, name) => {
    if (!id) {
      console.error('Delete called with missing product ID');
      return;
    }

    try {
      await deleteProduct(id, token);
      setStatusMsg(`✓ "${name}" deleted successfully.`);
      // Optimistically update list
      setListings((prev) => prev.filter((item) => (item.id || item._id) !== id));
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      console.warn('Backend delete error, removing locally:', err.message);
      // Fallback: Remove locally so user is never blocked even if server was paused
      setListings((prev) => prev.filter((item) => (item.id || item._id) !== id));
      setStatusMsg(`✓ "${name}" removed from view (${err.message.includes('fetch') ? 'Backend offline' : err.message}).`);
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '26px' }}>Farmer Dashboard</h1>
          <p style={{ color: 'var(--gray)', fontSize: '13px' }}>
            Manage your crop listings, track your inventory, and view inquiries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/orders"
            className="secondary-btn"
            style={{ padding: '9px 16px', background: 'white' }}
          >
            📦 Incoming Orders
          </Link>
          <button
            className="primary-btn"
            onClick={() => setShowAddModal(true)}
            style={{ padding: '10px 18px' }}
          >
            + Add New Produce
          </button>
        </div>
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

      <div className="stats-grid">
        <div className="stat-box">
          <h4>My Active Listings</h4>
          <div className="stat-val">{listings.length}</div>
        </div>
        <div className="stat-box">
          <h4>Total Stock Available</h4>
          <div className="stat-val">
            {listings.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0)} units
          </div>
        </div>
        <div className="stat-box">
          <h4>Estimated Inventory Value</h4>
          <div className="stat-val">
            ₹
            {listings
              .reduce(
                (acc, curr) =>
                  acc + (Number(curr.price) || 0) * (Number(curr.stock) || 20),
                0
              )
              .toLocaleString()}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h2 style={{ fontSize: '18px' }}>Active Crop & Produce Listings</h2>
        <button
          onClick={loadListings}
          style={{
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ padding: '40px 0', textAlign: 'center', color: 'var(--gray)' }}>
          Loading your listings from Kisan Market API...
        </p>
      ) : listings.length === 0 ? (
        <div className="no-products-msg">
          <p>You have no active listings. Click "+ Add New Produce" to publish your first crop!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Produce</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Origin / Mandi</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>
                      {item.icon || '🌾'} {item.name}
                    </strong>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <strong>₹{item.price}</strong> / {item.unit || 'kg'}
                  </td>
                  <td>{item.stock} {item.unit || 'kg'}</td>
                  <td>{item.location || 'Direct Farm'}</td>
                  <td>
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      Active
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id || item._id, item.name)}
                      style={{
                        border: 'none',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        padding: '6px 12px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>

            <h3 style={{ marginBottom: '15px' }}>Publish Agricultural Produce</h3>

            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Crop / Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Mustard Seeds"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Organic">Organic</option>
                    <option value="Dairy">Dairy</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 55"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  >
                    <option value="kg">per kg</option>
                    <option value="quintal">per quintal</option>
                    <option value="ton">per ton</option>
                    <option value="L">per Litre</option>
                    <option value="dozen">per dozen</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Available Stock</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Origin Mandi / Farm Location</label>
                <input
                  type="text"
                  placeholder="e.g. Alwar Mandi, Rajasthan"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description & Quality</label>
                <textarea
                  rows="3"
                  placeholder="Freshly harvested, pesticide-free, graded quality..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="secondary-btn"
                  style={{ flex: 1, padding: '10px' }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
