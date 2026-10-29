import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);

      if (redirect) {
        navigate(redirect);
      } else if (user.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your Kisan Market account</p>

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
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
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
