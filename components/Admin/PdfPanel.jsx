'use client';

import { useState, useEffect } from 'react';
import { FileText, Trash2, Edit2, Plus, ExternalLink, Loader2 } from 'lucide-react';

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
    <div style={{ backgroundColor: '#111722', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="#38bdf8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>PDF & Catalog Library</h3>
          <span style={{ fontSize: '12px', background: '#1e293b', padding: '2px 8px', borderRadius: '12px' }}>{pdfs.length}</span>
        </div>
        <button
          onClick={() => {
            setEditingPdf(null);
            setFormData({ title: '', description: '', category: 'Machinery Datasheet', fileUrl: '', fileName: '', active: true });
            setShowAddModal(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0284c7', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
        >
          <Plus size={14} /> Add PDF
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
          <Loader2 className="animate-spin" size={18} style={{ display: 'inline', marginRight: '6px' }} /> Loading PDF records...
        </div>
      ) : pdfs.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
          No PDF documents found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
          {pdfs.map((pdf) => {
            const itemKey = pdf._id || pdf.id;
            return (
              <div key={itemKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#0a0d14', border: '1px solid #1e293b', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={16} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pdf.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      <span style={{ color: '#38bdf8' }}>{pdf.category}</span>
                      <span>• {pdf.downloadCount || 0} downloads</span>
                      <span style={{ color: pdf.active ? '#4ade80' : '#f87171' }}>{pdf.active ? 'Active' : 'Hidden'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <a href={pdf.fileUrl} target="_blank" rel="noreferrer" title="Open PDF" style={{ color: '#94a3b8', padding: '4px' }}>
                    <ExternalLink size={15} />
                  </a>
                  <button onClick={() => openEdit(pdf)} style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }}>
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(itemKey)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#111722', border: '1px solid #334155', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>{editingPdf ? 'Edit PDF Details' : 'Add New PDF'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>PDF Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a0d14', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>PDF URL *</label>
                <input
                  type="url"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://ik.imagekit.io/..."
                  style={{ width: '100%', padding: '8px 12px', background: '#0a0d14', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px', background: '#0a0d14', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                  >
                    <option value="Machinery Datasheet">Machinery Datasheet</option>
                    <option value="Brochure">Brochure</option>
                    <option value="Technical Manual">Technical Manual</option>
                    <option value="Corporate Profile">Corporate Profile</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                    style={{ width: '100%', padding: '8px', background: '#0a0d14', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a0d14', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '6px 16px', background: '#0284c7', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
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