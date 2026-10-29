import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [role, setRole] = useState('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const user = await register({
        name,
        email,
        password,
        role,
        phone,
        location,
      });

      if (user.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="subtitle">Join Kisan Market community today</p>

        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === 'farmer' ? 'active' : ''}`}
            onClick={() => setRole('farmer')}
          >
            👨‍🌾 Farmer
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
            onClick={() => setRole('buyer')}
          >
            🛒 Buyer
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              background: '#fee2e2',
              color: '#b91c1c',
              marginBottom: '15px',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="e.g. ramesh@kisanmarket.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone / WhatsApp Number</label>
            <input
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Farm / City Location</label>
            <input
              type="text"
              placeholder="e.g. Jaipur, Rajasthan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password (min 6 characters) *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Buyer'}`}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '13px',
            color: 'var(--gray)',
          }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--green)', fontWeight: '600' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
