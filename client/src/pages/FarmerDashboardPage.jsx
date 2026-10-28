import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function FarmerDashboardPage() {
  const [listings, setListings] = useState(MOCK_PRODUCTS.slice(0, 4));
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    stock: '',
    description: '',
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newProduct = {
      id: String(Date.now()),
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      unit: formData.unit,
      stock: Number(formData.stock) || 100,
      farmer: 'Logged In Farmer',
      location: 'Local Farm',
      description: formData.description || 'Farm-fresh crop listing',
      icon:
        formData.category === 'Vegetables'
          ? '🥦'
          : formData.category === 'Fruits'
          ? '🍎'
          : formData.category === 'Grains'
          ? '🌾'
          : '🌱',
    };

    setListings([newProduct, ...listings]);
    setFormData({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: 'kg',
      stock: '',
      description: '',
    });
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setListings(listings.filter((item) => item.id !== id));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '26px' }}>Farmer Dashboard</h1>
          <p style={{ color: 'var(--gray)', fontSize: '13px' }}>
            Manage your agricultural produce, check mandi rates, and view orders.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowAddModal(true)}
          style={{ padding: '10px 18px' }}
        >
          + Add New Produce
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h4>My Active Listings</h4>
          <div className="stat-val">{listings.length}</div>
        </div>
        <div className="stat-box">
          <h4>Total Inquiries</h4>
          <div className="stat-val">18</div>
        </div>
        <div className="stat-box">
          <h4>Estimated Value</h4>
          <div className="stat-val">
            ₹
            {listings
              .reduce((acc, curr) => acc + curr.price * (curr.stock || 50), 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>
        Current Crop & Produce Listings
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Produce</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>
                    {item.icon} {item.name}
                  </strong>
                </td>
                <td>{item.category}</td>
                <td>
                  ₹{item.price} / {item.unit}
                </td>
                <td>{item.stock} {item.unit}</td>
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
                    onClick={() => handleDelete(item.id)}
                    style={{
                      border: 'none',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '12px',
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>

            <h3 style={{ marginBottom: '15px' }}>Add Agricultural Produce</h3>

            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Crop / Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Mustard"
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
                  <label>Category</label>
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
                    placeholder="45"
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
                  <label>Available Quantity</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Mention quality, harvest date, location..."
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
