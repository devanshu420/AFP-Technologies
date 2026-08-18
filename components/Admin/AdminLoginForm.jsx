'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 🟢 Added Router
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminLoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter(); // 🟢 Initialize router

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');

    try {
      const res = await fetch(`${cleanBaseUrl}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json?.success && json?.data) {
        // Tab session storage me save
        sessionStorage.setItem(
          'admin_session_user',
          JSON.stringify(json.data.admin || json.data)
        );

        if (onLoginSuccess) {
          onLoginSuccess(json.data.admin || json.data);
        }

        // 🟢 Redirect to Admin Dashboard / Products after successful login
        router.push('/admin');
        router.refresh();
      } else {
        setMessage(json?.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setMessage(
        `Backend server unreachable. Make sure backend is running at ${cleanBaseUrl}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck size={26} />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-sky-400">
            AFP Technologies
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Admin Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your credentials to access system control
          </p>
        </div>

        {/* Error Alert */}
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{message}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@afptechnologies.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 active:scale-[0.99] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-sky-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}