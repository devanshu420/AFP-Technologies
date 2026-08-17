'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

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
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 3vw, 2rem)',
        boxSizing: 'border-box',
      }}
    >
      <form
        className="admin-card login-card"
        onSubmit={handleLogin}
        style={{
          width: '100%',
          maxWidth: '440px',
          margin: '0 auto',
          padding: 'clamp(1.25rem, 4vw, 2.25rem)',
          boxSizing: 'border-box',
        }}
      >
        <Link
          className="brand admin-brand"
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
            fontWeight: 800,
            textDecoration: 'none',
            marginBottom: '0.25rem',
          }}
        >
          AFP Technologies<span className="brand-dot">.</span>
        </Link>

        <p className="kicker dark" style={{ margin: '0 0 0.5rem 0' }}>
          <span /> ADMIN PORTAL
        </p>

        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
            lineHeight: 1.2,
            margin: '0 0 0.5rem 0',
            fontWeight: 800,
          }}
        >
          Run the operation.
        </h1>

        <p
          className="admin-muted"
          style={{
            fontSize: 'clamp(0.82rem, 1.8vw, 0.92rem)',
            lineHeight: 1.5,
            margin: '0 0 1.5rem 0',
          }}
        >
          Sign in to manage machinery showcase, categories, and customer leads.
        </p>

        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
            width: '100%',
          }}
        >
          Email
          <input
            required
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            type="email"
            placeholder="admin@example.com"
            style={{
              width: '100%',
              padding: 'clamp(0.65rem, 1.8vw, 0.8rem) clamp(0.75rem, 2vw, 0.9rem)',
              fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </label>

        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
            width: '100%',
          }}
        >
          Password
          <input
            required
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            type="password"
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: 'clamp(0.65rem, 1.8vw, 0.8rem) clamp(0.75rem, 2vw, 0.9rem)',
              fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </label>

        {message && (
          <p
            className="form-error"
            style={{
              fontSize: '0.84rem',
              margin: '0 0 1rem 0',
              wordBreak: 'break-word',
            }}
          >
            {message}
          </p>
        )}

        <button
          className="button primary"
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: 'clamp(0.7rem, 2vw, 0.85rem) 1.25rem',
            fontSize: 'clamp(0.85rem, 1.8vw, 0.92rem)',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.75 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Enter dashboard</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}