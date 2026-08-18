'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Mail,
  Phone,
  Clock,
  Inbox,
  Check,
  RotateCcw,
  ChevronRight,
  X,
} from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EnquiryPanel({ onEnquiryCountChange }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'read' | 'all'
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  async function loadEnquiries() {
  setLoading(true);
  try {
    const token = sessionStorage.getItem('admin_jwt_token');

    const res = await fetch(`${API_BASE_URL}/enquiries?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    const data = await res.json();
    const list =
      data?.data?.enquiries ||
      (Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    setEnquiries(list);

    if (onEnquiryCountChange) {
      const newCount = list.filter((e) => e.status === 'new').length;
      onEnquiryCountChange({ total: list.length, unread: newCount });
    }
  } catch (err) {
    console.error('Failed to load enquiries', err);
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    loadEnquiries();
  }, []);

  // Update status function (Cleanly updates state and triggers parent outside updater)
  async function updateStatus(id, nextStatus) {
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        let updatedList = [];
        setEnquiries((prev) => {
          updatedList = prev.map((item) =>
            item._id === id ? { ...item, status: nextStatus } : item
          );
          return updatedList;
        });

        // 🔒 Trigger parent callback OUTSIDE the setState updater function to prevent React error
        if (onEnquiryCountChange) {
          const newCount = updatedList.filter((e) => e.status === 'new').length;
          onEnquiryCountChange({ total: updatedList.length, unread: newCount });
        }

        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev) => ({ ...prev, status: nextStatus }));
        }
      }
    } catch (err) {
      console.error('Failed to update enquiry status', err);
    }
  }

  // Auto mark as read on click
  const handleOpenEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    if (enquiry.status === 'new') {
      updateStatus(enquiry._id, 'contacted');
    }
  };

  // Toggle button inside row or modal
  const toggleStatus = (id, currentStatus, e) => {
    if (e) e.stopPropagation();
    const nextStatus = currentStatus === 'new' ? 'contacted' : 'new';
    updateStatus(id, nextStatus);
  };

  const filteredEnquiries = enquiries.filter((item) => {
    if (activeTab === 'new') return item.status === 'new';
    if (activeTab === 'read') return item.status !== 'new';
    return true;
  });

  const unreadCount = enquiries.filter((e) => e.status === 'new').length;
  const readCount = enquiries.filter((e) => e.status !== 'new').length;

  return (
    <section className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-xl text-slate-100 flex flex-col justify-between transition-all">
      <div className="w-full flex flex-col flex-1">
        {/* Panel Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3.5 mb-4 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  Customer Inquiries & Leads
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {enquiries.length} Total
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800/60 text-amber-300 animate-pulse">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-[10.5px] text-slate-400 mt-0.5 truncate">
                Direct buyer inquiries submitted through website forms
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadEnquiries}
            disabled={loading}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 border border-slate-800 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            title="Refresh inquiries"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-sky-400' : ''} />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800/80 mb-3.5 max-w-full overflow-x-auto">
          {/* 1. New Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('new')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'new'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeTab === 'new' ? 'bg-white' : 'bg-amber-400'
              }`}
            />
            <span>New Leads</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'new'
                  ? 'bg-amber-800 text-amber-100'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {unreadCount}
            </span>
          </button>

          {/* 2. Reviewed Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('read')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'read'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Check size={12} className={activeTab === 'read' ? 'text-emerald-400' : 'text-slate-500'} />
            <span>Reviewed</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800">
              {readCount}
            </span>
          </button>

          {/* 3. All Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>All Leads</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800">
              {enquiries.length}
            </span>
          </button>
        </div>

        {/* Enquiry Cards List */}
        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 animate-pulse space-y-2">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading inquiries...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/80 px-4">
              <Inbox size={26} className="mx-auto mb-2 text-slate-600 opacity-60" />
              <p className="font-semibold text-slate-400">
                {activeTab === 'new'
                  ? 'No unread inquiries in inbox'
                  : 'No inquiries in this section'}
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                New submissions from your website contact forms will appear here.
              </p>
            </div>
          ) : (
            filteredEnquiries.map((enquiry) => {
              const isNew = enquiry.status === 'new';

              return (
                <div
                  key={enquiry._id}
                  onClick={() => handleOpenEnquiry(enquiry)}
                  className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isNew
                      ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-950/30'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${
                      isNew ? 'bg-amber-500' : 'bg-transparent'
                    }`}
                  />

                  <div className="min-w-0 flex-1 pl-2.5 pr-2">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <strong className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                        {enquiry.name || 'Anonymous Buyer'}
                      </strong>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(enquiry.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400 flex-wrap">
                      <span className="text-sky-400 font-medium truncate max-w-[160px]">
                        {enquiry.email}
                      </span>
                      {enquiry.phone && (
                        <span className="text-emerald-400 font-semibold truncate">
                          {enquiry.phone}
                        </span>
                      )}
                      {enquiry.company && (
                        <span className="text-slate-400 truncate max-w-[140px]">
                          🏢 {enquiry.company}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400/80 mt-1 line-clamp-1">
                      {enquiry.message || 'No requirement description provided'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => toggleStatus(enquiry._id, enquiry.status, e)}
                      title={isNew ? 'Click to mark as Read' : 'Click to mark as New'}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                        isNew
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {isNew ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span>New</span>
                        </>
                      ) : (
                        <>
                          <Check size={11} className="text-emerald-400" />
                          <span>Read</span>
                        </>
                      )}
                    </button>

                    <ChevronRight
                      size={15}
                      className="text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Customer Enquiry Modal Dialog */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded">
                    Lead Details
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(selectedEnquiry.createdAt || Date.now()).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {selectedEnquiry.name || 'Anonymous Buyer'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="block text-[10px] font-semibold text-slate-400">Email Address</span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="text-xs font-semibold text-sky-400 hover:underline break-all"
                >
                  {selectedEnquiry.email}
                </a>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="block text-[10px] font-semibold text-slate-400">Phone Number</span>
                {selectedEnquiry.phone ? (
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="text-xs font-semibold text-emerald-400 hover:underline"
                  >
                    {selectedEnquiry.phone}
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">Not provided</span>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="block text-[10px] font-semibold text-slate-400">Company / Plant</span>
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {selectedEnquiry.company || 'Direct Buyer'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="block text-[10px] font-semibold text-slate-400">Requested Product / Line</span>
                <p className="text-xs font-semibold text-amber-300 truncate">
                  {selectedEnquiry.product || 'General Technical Consultation'}
                </p>
              </div>
            </div>

            {/* Message Requirement Body */}
            <div className="mb-4 flex-1 min-h-0 flex flex-col">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Client Requirement & Message:
              </span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed overflow-y-auto whitespace-pre-wrap flex-1 max-h-[180px]">
                {selectedEnquiry.message || 'No additional message was submitted.'}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() =>
                  toggleStatus(selectedEnquiry._id, selectedEnquiry.status)
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              >
                {selectedEnquiry.status === 'new' ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span>Mark as Read</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={13} className="text-amber-400" />
                    <span>Mark as New</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {selectedEnquiry.phone && (
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-xs font-semibold transition-colors"
                  >
                    <Phone size={13} />
                    <span>Call</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Regarding your Machinery Inquiry - AFP Technologies`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Mail size={13} />
                  <span>Reply Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}