import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [role, setRole] = useState('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatusMsg('Please provide both email and password.');
      return;
    }

    setStatusMsg(`Logging in as ${role}... (Frontend UI ready, connecting to JWT in M5)`);
    setTimeout(() => {
      if (role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/products');
      }
    }, 1000);
  };

  return (
    <div className="form-page-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your Kisan Market account</p>

        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === 'farmer' ? 'active' : ''}`}
            onClick={() => setRole('farmer')}
          >
            👨‍🌾 I am a Farmer
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
            onClick={() => setRole('buyer')}
          >
            🛒 I am a Buyer
          </button>
        </div>

        {statusMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              background: '#e0f2fe',
              color: '#0369a1',
              marginBottom: '15px',
            }}
          >
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. farmer@kisanmarket.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
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
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            Sign In
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
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--green)', fontWeight: '600' }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
