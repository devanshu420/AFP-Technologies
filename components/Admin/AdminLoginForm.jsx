'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminLoginForm({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        onLoginSuccess(json.data);
      } else {
        setMessage(json.message || 'Invalid credentials');
      }
    } catch {
      setMessage('Backend server is unreachable. Please check your API server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-card login-card" onSubmit={handleLogin}>
      <a className="brand admin-brand" href="/">
        AFP Technologies<span className="brand-dot">.</span>
      </a>
      <p className="kicker dark">
        <span /> ADMIN PORTAL
      </p>
      <h1>Run the operation.</h1>
      <p className="admin-muted">
        Sign in to manage machinery showcase, categories, and customer leads.
      </p>

      <label>
        Email
        <input
          required
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          type="email"
          placeholder="admin@example.com"
        />
      </label>

      <label>
        Password
        <input
          required
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          type="password"
          placeholder="••••••••"
        />
      </label>

      {message && <p className="form-error">{message}</p>}

      <button className="button primary" type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Enter dashboard'} <ArrowRight size={16} />
      </button>
    </form>
  );
}