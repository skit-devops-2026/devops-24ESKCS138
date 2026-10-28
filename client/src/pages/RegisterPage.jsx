import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [role, setRole] = useState('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setStatusMsg('Please fill in all required fields.');
      return;
    }

    setStatusMsg(`Registration submitted for ${name} (${role}). Connecting to backend in M5!`);
    setTimeout(() => {
      navigate('/login');
    }, 1200);
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

        {statusMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              background: '#dcfce7',
              color: '#15803d',
              marginBottom: '15px',
            }}
          >
            {statusMsg}
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
            <label>Password *</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            Register as {role === 'farmer' ? 'Farmer' : 'Buyer'}
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
