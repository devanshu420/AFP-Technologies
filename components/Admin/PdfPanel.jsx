'use client';

import { useState, useEffect } from 'react';
import { FileText, Trash2, Edit2, Plus, ExternalLink, Loader2, X } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PdfPanel({ onPdfCountChange }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPdf, setEditingPdf] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Machinery Datasheet',
    fileUrl: '',
    fileName: '',
    active: true,
  });

  async function fetchPdfs() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/downloads/admin/all`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const json = await res.json();
      const list = json?.data || [];
      setPdfs(list);
      if (onPdfCountChange) onPdfCountChange(list.length);
    } catch (err) {
      console.error('Error fetching admin PDFs:', err);
    } finally {
      setLoading(false);
    }
  }

  // Load once on mount
  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const pdfId = editingPdf?._id || editingPdf?.id;
      const url = editingPdf
        ? `${API_BASE_URL}/downloads/admin/${pdfId}`
        : `${API_BASE_URL}/downloads/admin/create`;
      const method = editingPdf ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowAddModal(false);
        setEditingPdf(null);
        setFormData({ title: '', description: '', category: 'Machinery Datasheet', fileUrl: '', fileName: '', active: true });
        fetchPdfs();
      }
    } catch (err) {
      alert('Failed to save PDF');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this PDF?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/downloads/admin/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) fetchPdfs();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const openEdit = (pdf) => {
    setEditingPdf(pdf);
    setFormData({
      title: pdf.title || '',
      description: pdf.description || '',
      category: pdf.category || 'Machinery Datasheet',
      fileUrl: pdf.fileUrl || '',
      fileName: pdf.fileName || '',
      active: pdf.active !== undefined ? pdf.active : true,
    });
    setShowAddModal(true);
  };

  return (
    <div
      style={{
        backgroundColor: '#111722',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: 'clamp(14px, 2.5vw, 20px)',
        color: '#fff',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Panel Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <FileText size={19} color="#38bdf8" style={{ flexShrink: 0 }} />
          <h3 style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 600, margin: 0, whiteSpace: 'nowrap' }}>
            PDF & Catalog Library
          </h3>
          <span style={{ fontSize: '11px', background: '#1e293b', padding: '2px 8px', borderRadius: '12px', color: '#94a3b8' }}>
            {pdfs.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPdf(null);
            setFormData({ title: '', description: '', category: 'Machinery Datasheet', fileUrl: '', fileName: '', active: true });
            setShowAddModal(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: '#0284c7',
            border: 'none',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            transition: 'background 0.2s ease',
          }}
        >
          <Plus size={14} /> <span>Add PDF</span>
        </button>
      </div>

      {/* Content List Area */}
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
          <Loader2 className="animate-spin" size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Loading PDF records...
        </div>
      ) : pdfs.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
          No PDF documents found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto', paddingRight: '2px' }}>
          {pdfs.map((pdf) => {
            const itemKey = pdf._id || pdf.id;
            return (
              <div
                key={itemKey}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 14px)',
                  background: '#0a0d14',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                }}
              >
                {/* Left Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 auto' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#f87171',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={16} />
                  </div>

                  <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: 'clamp(0.82rem, 1.8vw, 0.88rem)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: '#f8fafc',
                      }}
                      title={pdf.title}
                    >
                      {pdf.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 8px', fontSize: 'clamp(0.68rem, 1.6vw, 0.74rem)', color: '#64748b', marginTop: '2px' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 500 }}>{pdf.category}</span>
                      <span>• {pdf.downloadCount || 0} dl</span>
                      <span style={{ color: pdf.active ? '#4ade80' : '#f87171' }}>
                        {pdf.active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <a
                    href={pdf.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open PDF"
                    style={{
                      color: '#94a3b8',
                      padding: '5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                    }}
                  >
                    <ExternalLink size={14} />
                  </a>

                  <button
                    type="button"
                    onClick={() => openEdit(pdf)}
                    title="Edit PDF"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#38bdf8',
                      cursor: 'pointer',
                      padding: '5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                    }}
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(itemKey)}
                    title="Delete PDF"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Responsive Modal Dialog */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '12px',
            boxSizing: 'border-box',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#111722',
              border: '1px solid #334155',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: 'clamp(16px, 3vw, 22px)',
              boxSizing: 'border-box',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', color: '#fff', fontWeight: 700 }}>
                {editingPdf ? 'Edit PDF Details' : 'Add New PDF'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>PDF Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: '#0a0d14',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>PDF URL *</label>
                <input
                  type="url"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://ik.imagekit.io/..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: '#0a0d14',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#0a0d14',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  >
                    <option value="Machinery Datasheet">Machinery Datasheet</option>
                    <option value="Brochure">Brochure</option>
                    <option value="Technical Manual">Technical Manual</option>
                    <option value="Corporate Profile">Corporate Profile</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Status</label>
                  <select
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#0a0d14',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: '#0a0d14',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '6px 14px',
                    background: 'transparent',
                    border: '1px solid #475569',
                    color: '#cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '6px 16px',
                    background: '#0284c7',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Save PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}