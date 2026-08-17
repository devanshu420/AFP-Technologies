'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLoginForm from '../../components/Admin/AdminLoginForm';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminHeading from '../../components/Admin/AdminHeading';
import AdminStatsGrid from '../../components/Admin/AdminStatsGrid';
import ProductPanel from '../../components/Admin/ProductPanel';
import EnquiryPanel from '../../components/Admin/EnquiryPanel';
import PdfPanel from '../../components/Admin/PdfPanel';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    products: 0,
    newEnquiries: 0,
    totalPdfs: 0,
  });

  const verifyAdminToken = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin/me`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setAdminUser(json.data);
        setSession(true);
      } else {
        setAdminUser(null);
        setSession(false);
      }
    } catch {
      setAdminUser(null);
      setSession(false);
    }
  }, []);

  useEffect(() => {
    verifyAdminToken();
  }, [verifyAdminToken]);

  const handleProductCountChange = useCallback((count) => {
    setStats((prev) => (prev.products === count ? prev : { ...prev, products: count }));
  }, []);

  const handleEnquiryCountChange = useCallback((count) => {
    setStats((prev) => (prev.newEnquiries === count ? prev : { ...prev, newEnquiries: count }));
  }, []);

  const handlePdfCountChange = useCallback((count) => {
    setStats((prev) => (prev.totalPdfs === count ? prev : { ...prev, totalPdfs: count }));
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/auth/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setSession(false);
      setAdminUser(null);
      window.location.reload();
    }
  }

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

  return (
    <main className="admin-shell">
      <AdminHeader adminRole={adminUser?.role} onLogout={handleLogout} />

      <div className="admin-content">
        {/* Admin Heading ke andar hi Right side par button aa chuka hai */}
        <AdminHeading adminName={adminUser?.name} />

        <AdminStatsGrid stats={stats} />

        <div className="admin-panels" style={{ marginBottom: '24px' }}>
          <ProductPanel onProductCountChange={handleProductCountChange} />
          <EnquiryPanel onEnquiryCountChange={handleEnquiryCountChange} />
        </div>

        <div style={{ marginTop: '20px' }}>
          <PdfPanel onPdfCountChange={handlePdfCountChange} />
        </div>
      </div>
    </main>
  );
}