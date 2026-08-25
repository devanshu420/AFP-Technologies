'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, Edit3, Save, X, Loader2, CheckCircle2 } from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ContactSettingsPanel() {
  const [contact, setContact] = useState({
    salesPhoneNumber: '+91 98765 43210',
    inquiryEmail: 'afptechsupport@gmail.com',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ salesPhoneNumber: '', inquiryEmail: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(''); // 🟢 Success Notification State

  // Helper function to include Authorization token from session storage
  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_jwt_token') : '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch current details
  useEffect(() => {
    async function loadContact() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/settings/contact`);
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
    setSuccessMsg('');
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/settings/contact`, {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setContact(json.data);
        setIsModalOpen(false);
        setSuccessMsg('Contact settings updated successfully!'); // 🟢 Success Notification Trigger
        setTimeout(() => setSuccessMsg(''), 4000); // 4 seconds baad notification gayab ho jayegi
      } else {
        alert(json?.message || 'Failed to update contact settings');
      }
    } catch (err) {
      alert('Error updating contact settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* 🟢 Success Notification Banner */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Contact Badge Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-[260px] sm:min-w-[340px]">
        <div className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Public Contact Info
          </span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5 truncate">
              <Phone size={12} className="text-sky-400 shrink-0" />
              <span className="truncate">{loading ? '...' : contact.salesPhoneNumber}</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5 truncate">
              <Mail size={12} className="text-sky-400 shrink-0" />
              <span className="truncate">{loading ? '...' : contact.inquiryEmail}</span>
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={openEdit}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Edit3 size={13} />
          <span>Edit Info</span>
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-5 sm:p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white leading-none">
                  Edit Header & Footer Contact
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Updates public contact details across the website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sales & WhatsApp Phone Number *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.salesPhoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, salesPhoneNumber: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Inquiry & Support Email *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    required
                    value={formData.inquiryEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, inquiryEmail: e.target.value })
                    }
                    placeholder="contact@afptechnologies.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}