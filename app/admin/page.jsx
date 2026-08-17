'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLoginForm from '../../components/Admin/AdminLoginForm';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminHeading from '../../components/Admin/AdminHeading';
import AdminStatsGrid from '../../components/Admin/AdminStatsGrid';
import ProductPanel from '../../components/Admin/ProductPanel';
import EnquiryPanel from '../../components/Admin/EnquiryPanel';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
  const [session, setSession] = useState(null); // null = checking, false = locked, true = verified
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({ products: 0, newEnquiries: 0 });

  // 1. Strict Token Verification on Mount
  const verifyAdminToken = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin/me`, {
        method: 'GET',
        credentials: 'include', // HttpOnly cookie sath jayegi
        cache: 'no-store',      // Browser cache ko strictly disable kiya
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

      const json = await res.json();

      // Token sahi hai aur admin active hai tabhi access milega
      if (res.ok && json.success && json.data) {
        setAdminUser(json.data);
        setSession(true);
      } else {
        setAdminUser(null);
        setSession(false);
      }
    } catch (err) {
      // Backend error ya token invalid hone par seedha login screen
      setAdminUser(null);
      setSession(false);
    }
  }, []);

  useEffect(() => {
    verifyAdminToken();
  }, [verifyAdminToken]);

  // 2. Logout Handler (Cookie clear karega aur state lock karega)
  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/auth/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setSession(false);
      setAdminUser(null);
      window.location.reload(); // Clean state refresh
    }
  }

  // --- CASE 1: Verification In Progress (Protected Skeleton/Loader) ---
  if (session === null) {
    return (
      <main className="admin-shell">
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="kicker dark">
            <span /> SECURITY CHECK
          </p>
          <h2>Verifying token authorization...</h2>
        </div>
      </main>
    );
  }

  // --- CASE 2: Token Missing ya Invalid (Sirf Login Form Dikhega) ---
  if (!session) {
    return (
      <main className="admin-shell">
        <AdminLoginForm
          onLoginSuccess={(userData) => {
            setAdminUser(userData);
            setSession(true);
          }}
        />
      </main>
    );
  }

  // --- CASE 3: Token Verified (Sirf Authorized Admin ko Access) ---
  return (
    <main className="admin-shell">
      <AdminHeader adminRole={adminUser?.role} onLogout={handleLogout} />

      <div className="admin-content">
        <AdminHeading adminName={adminUser?.name} />

        <AdminStatsGrid stats={stats} />

        <div className="admin-grid">
          <ProductPanel
            onProductCountChange={(count) =>
              setStats((prev) => ({ ...prev, products: count }))
            }
          />
          <EnquiryPanel
            onEnquiryCountChange={(count) =>
              setStats((prev) => ({ ...prev, newEnquiries: count }))
            }
          />
        </div>
      </div>
    </main>
  );
}