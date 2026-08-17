'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Calendar,
  Layers,
  X,
  ChevronRight,
  Check,
  RotateCcw,
  User,
  Clock,
  Send,
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
      const res = await fetch(`${API_BASE_URL}/enquiries?limit=100`, {
        credentials: 'include',
      });
      const data = await res.json();
      const list = data?.data?.enquiries || [];
      setEnquiries(list);

      if (onEnquiryCountChange) {
        const newCount = list.filter((e) => e.status === 'new').length;
        onEnquiryCountChange(newCount);
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

  // Simple toggle: 'new' <-> 'contacted' (Read)
  async function toggleStatus(id, currentStatus) {
    const nextStatus = currentStatus === 'new' ? 'contacted' : 'new';
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: nextStatus } : item
          )
        );

        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev) => ({ ...prev, status: nextStatus }));
        }

        if (onEnquiryCountChange) {
          const updatedNewCount = enquiries.filter((e) =>
            e._id === id ? nextStatus === 'new' : e.status === 'new'
          ).length;
          onEnquiryCountChange(updatedNewCount);
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  }

  const filteredEnquiries = enquiries.filter((item) => {
    if (activeTab === 'new') return item.status === 'new';
    if (activeTab === 'read') return item.status !== 'new';
    return true;
  });

  const unreadCount = enquiries.filter((e) => e.status === 'new').length;
  const readCount = enquiries.filter((e) => e.status !== 'new').length;

  return (
    <section className="admin-panel" style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      {/* Panel Header */}
      <div
        className="panel-heading"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <p className="kicker dark" style={{ margin: '0 0 2px 0' }}>
            <span /> INBOX
          </p>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', color: '#ffffff', fontWeight: 800 }}>
            Leads & Inquiries
          </h2>
        </div>
        <button
          className="icon-button refresh"
          onClick={loadEnquiries}
          disabled={loading}
          title="Refresh enquiries"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#e2e8f0',
            borderRadius: '8px',
            padding: '7px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* 📱 Responsive Scrollable Tab Filters */}
      <div
        style={{
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1rem',
          WebkitOverflowScrolling: 'touch',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px',
            backgroundColor: '#07101c',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            minWidth: 'max-content',
          }}
        >
          {/* 1. New Leads Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('new')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: 'clamp(0.75rem, 2vw, 0.84rem)',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'new' ? '1px solid #0284c7' : '1px solid transparent',
              backgroundColor: activeTab === 'new' ? '#0369a1' : 'transparent',
              color: activeTab === 'new' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: activeTab === 'new' ? '#ffffff' : '#38bdf8',
                flexShrink: 0,
              }}
            />
            <span>New Leads</span>
            <span
              style={{
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: activeTab === 'new' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              {unreadCount}
            </span>
          </button>

          {/* 2. Reviewed Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('read')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: 'clamp(0.75rem, 2vw, 0.84rem)',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'read' ? '1px solid #334155' : '1px solid transparent',
              backgroundColor: activeTab === 'read' ? '#1e293b' : 'transparent',
              color: activeTab === 'read' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Check size={13} color={activeTab === 'read' ? '#10b981' : '#64748b'} />
            <span>Reviewed</span>
            <span
              style={{
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: activeTab === 'read' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              {readCount}
            </span>
          </button>

          {/* 3. All Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: 'clamp(0.75rem, 2vw, 0.84rem)',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'all' ? '1px solid #334155' : '1px solid transparent',
              backgroundColor: activeTab === 'all' ? '#1e293b' : 'transparent',
              color: activeTab === 'all' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>All</span>
            <span
              style={{
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: activeTab === 'all' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              {enquiries.length}
            </span>
          </button>
        </div>
      </div>

      {/* 📜 Responsive Scrollable Enquiry Cards Container */}
      <div
        className="admin-list"
        style={{
          maxHeight: '520px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '2px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {loading ? (
          <p style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            Loading database leads...
          </p>
        ) : filteredEnquiries.length === 0 ? (
          <p style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            {activeTab === 'new'
              ? 'No new unread inquiries in inbox.'
              : 'No inquiries in this category.'}
          </p>
        ) : (
          filteredEnquiries.map((enquiry) => {
            const isNew = enquiry.status === 'new';

            return (
              <div
                key={enquiry._id}
                onClick={() => setSelectedEnquiry(enquiry)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'nowrap',
                  gap: '8px sm:gap-12px',
                  padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 14px)',
                  backgroundColor: isNew ? '#0b192c' : '#08111e',
                  border: '1px solid',
                  borderColor: isNew ? 'rgba(56, 189, 248, 0.28)' : 'rgba(255, 255, 255, 0.07)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  borderLeft: isNew ? '3px solid #38bdf8' : '3px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.15s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                  e.currentTarget.style.backgroundColor = '#0e2038';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isNew
                    ? 'rgba(56, 189, 248, 0.28)'
                    : 'rgba(255, 255, 255, 0.07)';
                  e.currentTarget.style.backgroundColor = isNew ? '#0b192c' : '#08111e';
                }}
              >
                {/* Left Content Area */}
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                  {/* Name & Timestamp */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                    <strong
                      style={{
                        fontSize: 'clamp(0.88rem, 2.2vw, 1rem)',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '0.01em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '220px',
                      }}
                    >
                      {enquiry.name}
                    </strong>

                    <span
                      style={{
                        fontSize: 'clamp(0.68rem, 1.8vw, 0.75rem)',
                        color: '#94a3b8',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      • {new Date(enquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Metadata: Email, Phone & Company */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '4px 8px',
                      fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)',
                      color: '#cbd5e1',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#60a5fa', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', whiteSpace: 'nowrap' }}>
                      {enquiry.email}
                    </span>

                    {enquiry.phone && (
                      <span style={{ color: '#34d399', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {enquiry.phone}
                      </span>
                    )}

                    {enquiry.company && (
                      <span style={{ color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px', whiteSpace: 'nowrap' }}>
                        🏢 {enquiry.company}
                      </span>
                    )}
                  </div>

                  {/* Message Snippet */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'clamp(0.75rem, 1.8vw, 0.82rem)',
                      color: '#94a3b8',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    }}
                  >
                    {enquiry.message || 'No description provided'}
                  </p>
                </div>

                {/* Right: Quick Action Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                    marginLeft: '4px',
                  }}
                >
                  {/* 1-Click Status Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(enquiry._id, enquiry.status);
                    }}
                    title={isNew ? 'Click to mark as Read' : 'Click to mark as New'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isNew ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.12)',
                      backgroundColor: isNew ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      color: isNew ? '#38bdf8' : '#94a3b8',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isNew ? (
                      <>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#38bdf8', flexShrink: 0 }} />
                        <span>New</span>
                      </>
                    ) : (
                      <>
                        <Check size={11} color="#10b981" />
                        <span>Read</span>
                      </>
                    )}
                  </button>

                  {/* Clean Arrow Trigger */}
                  <div
                    style={{
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px',
                    }}
                  >
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🔍 Responsive Customer Enquiry Modal Dialog */}
      {selectedEnquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 'clamp(8px, 2vw, 16px)',
            boxSizing: 'border-box',
          }}
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '580px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#091524',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '0.75rem',
                gap: '10px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    color: '#38bdf8',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                  }}
                >
                  Commercial Inquiry
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)', color: '#ffffff', fontWeight: 800, wordBreak: 'break-word' }}>
                  {selectedEnquiry.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Info Grid (Responsive Columns) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '8px',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Email Address</span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  style={{ color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}
                >
                  {selectedEnquiry.email}
                </a>
              </div>

              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Phone Number</span>
                {selectedEnquiry.phone ? (
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {selectedEnquiry.phone}
                  </a>
                ) : (
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Not provided</span>
                )}
              </div>

              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Company / Plant</span>
                <strong style={{ color: '#ffffff', fontSize: '0.85rem', wordBreak: 'break-word' }}>
                  {selectedEnquiry.company || 'Direct Client'}
                </strong>
              </div>

              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Requested System</span>
                <strong style={{ color: '#38bdf8', fontSize: '0.85rem', wordBreak: 'break-word' }}>
                  {selectedEnquiry.product || 'General Technical Consultation'}
                </strong>
              </div>
            </div>

            {/* Complete Client Requirement Scope */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
                Requirements & Message:
              </span>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#050c16',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  wordBreak: 'break-word',
                }}
              >
                {selectedEnquiry.message || 'No additional message was submitted.'}
              </div>
            </div>

            {/* Modal Actions (Wrap on Mobile) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '0.85rem',
              }}
            >
              {/* Toggle Status Button inside Modal */}
              <button
                type="button"
                onClick={() => toggleStatus(selectedEnquiry._id, selectedEnquiry.status)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: '1 1 auto',
                  justifyContent: 'center',
                  maxWidth: '160px',
                }}
              >
                {selectedEnquiry.status === 'new' ? (
                  <>
                    <Check size={13} color="#10b981" /> Mark as Read
                  </>
                ) : (
                  <>
                    <RotateCcw size={13} color="#38bdf8" /> Mark as New
                  </>
                )}
              </button>

              {/* Direct Reply Actions */}
              <div style={{ display: 'flex', gap: '6px', flex: '1 1 auto', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {selectedEnquiry.phone && (
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(52, 211, 153, 0.12)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      color: '#34d399',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      flex: '1 1 auto',
                    }}
                  >
                    <Phone size={13} /> Call
                  </a>
                )}

                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Regarding your Machinery Inquiry - AFP Technologies`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    flex: '1 1 auto',
                  }}
                >
                  <Mail size={13} /> Reply
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}