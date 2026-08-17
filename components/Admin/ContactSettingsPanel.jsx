'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, Edit3, Save, X, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ContactSettingsPanel() {
  const [contact, setContact] = useState({
    salesPhoneNumber: '+91 98765 43210',
    inquiryEmail: 'contact@machina.industries',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ salesPhoneNumber: '', inquiryEmail: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch current details
  useEffect(() => {
    async function loadContact() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/settings/contact`, { cache: 'no-store' });
        const json = await res.json();
        if (res.ok && json.data) {
          setContact(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, []);

  const openEdit = () => {
    setFormData({
      salesPhoneNumber: contact.salesPhoneNumber || '',
      inquiryEmail: contact.inquiryEmail || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/settings/contact`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setContact(json.data);
        setIsModalOpen(false);
      } else {
        alert('Failed to update');
      }
    } catch {
      alert('Error updating contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#111722', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Header & Footer Contact Info</h4>
          <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} color="#38bdf8" /> {loading ? '...' : contact.salesPhoneNumber}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} color="#38bdf8" /> {loading ? '...' : contact.inquiryEmail}
            </span>
          </div>
        </div>

        <button
          onClick={openEdit}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            backgroundColor: '#0284c7',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Edit3 size={13} /> Edit Contact
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#111722', border: '1px solid #334155', borderRadius: '12px', width: '100%', maxWidth: '380px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '15px' }}>Edit Contact Details</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Sales & Engineering Phone</label>
                <input
                  type="text"
                  required
                  value={formData.salesPhoneNumber}
                  onChange={(e) => setFormData({ ...formData, salesPhoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#0a0d14', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Inquiry Email</label>
                <input
                  type="email"
                  required
                  value={formData.inquiryEmail}
                  onChange={(e) => setFormData({ ...formData, inquiryEmail: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#0a0d14', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', background: '#0284c7', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}