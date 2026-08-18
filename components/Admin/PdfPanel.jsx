'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Trash2,
  Edit2,
  Plus,
  ExternalLink,
  Loader2,
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PdfPanel({ onPdfCountChange }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPdf, setEditingPdf] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

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

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setPdfs(list);
      if (onPdfCountChange) onPdfCountChange(list.length);
    } catch (err) {
      console.error('Error fetching admin PDFs:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleFileChange = (e) => {
    setErrorMessage('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Please select a valid PDF (.pdf) file.');
        return;
      }
      setSelectedFile(file);

      // Auto populate title only if title input is currently empty
      if (!formData.title.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setFormData((prev) => ({
          ...prev,
          title: cleanName,
          fileName: file.name,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          fileName: file.name,
        }));
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const titleValue = formData.title.trim();
    if (!titleValue) {
      setErrorMessage('Please enter document title.');
      return;
    }

    if (!editingPdf && !selectedFile && !formData.fileUrl) {
      setErrorMessage('Please upload a PDF file.');
      return;
    }

    try {
      setUploading(true);
      const pdfId = editingPdf?._id || editingPdf?.id;
      const url = editingPdf
        ? `${API_BASE_URL}/downloads/admin/${pdfId}`
        : `${API_BASE_URL}/downloads/admin/create`;

      let bodyData;
      let headers = {};

      if (selectedFile) {
        const data = new FormData();
        data.append('file', selectedFile);
        data.append('pdf', selectedFile); // fallback key
        data.append('title', titleValue);
        data.append('description', formData.description || '');
        data.append('category', formData.category || 'Machinery Datasheet');
        data.append('fileName', selectedFile.name);
        data.append('active', formData.active ? 'true' : 'false');
        bodyData = data;
      } else {
        headers['Content-Type'] = 'application/json';
        bodyData = JSON.stringify({
          ...formData,
          title: titleValue,
        });
      }

      const res = await fetch(url, {
        method: editingPdf ? 'PUT' : 'POST',
        credentials: 'include',
        headers,
        body: bodyData,
      });

      const json = await res.json().catch(() => null);

      if (res.ok && (json?.success || json?.data)) {
        setShowAddModal(false);
        setEditingPdf(null);
        setSelectedFile(null);
        setFormData({
          title: '',
          description: '',
          category: 'Machinery Datasheet',
          fileUrl: '',
          fileName: '',
          active: true,
        });
        fetchPdfs();
      } else {
        setErrorMessage(json?.message || 'Failed to save PDF. Please check server logs.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Connection error while saving PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this PDF document?')) return;
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
    setSelectedFile(null);
    setErrorMessage('');
    setFormData({
      title: pdf.title || '',
      description: pdf.description || '',
      category: pdf.category || 'Machinery Datasheet',
      fileUrl: pdf.fileUrl || pdf.url || '',
      fileName: pdf.fileName || '',
      active: pdf.active !== undefined ? pdf.active : true,
    });
    setShowAddModal(true);
  };

  return (
    <section className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-xl text-slate-100 flex flex-col justify-between transition-all">
      <div className="w-full flex flex-col flex-1">
        {/* Panel Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3.5 mb-4 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  PDF & Catalog Library
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/60 text-emerald-400">
                  {pdfs.length} Total
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 mt-0.5 truncate">
                Technical datasheets, machinery brochures & operator guides
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditingPdf(null);
                setSelectedFile(null);
                setErrorMessage('');
                setFormData({
                  title: '',
                  description: '',
                  category: 'Machinery Datasheet',
                  fileUrl: '',
                  fileName: '',
                  active: true,
                });
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus size={14} /> <span>Upload New PDF</span>
            </button>

            <button
              type="button"
              onClick={fetchPdfs}
              disabled={loading}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 border border-slate-800 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
              title="Refresh PDF list"
            >
              <Loader2 size={14} className={loading ? 'animate-spin text-sky-400' : 'hidden'} />
              {!loading && <FileText size={14} />}
            </button>
          </div>
        </div>

        {/* Content List Area */}
        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 animate-pulse space-y-2">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading PDF records...</p>
            </div>
          ) : pdfs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/80 px-4">
              <FileText size={26} className="mx-auto mb-2 text-slate-600 opacity-60" />
              <p className="font-semibold text-slate-400">No PDF documents found</p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Upload your first technical brochure or catalog above.
              </p>
            </div>
          ) : (
            pdfs.map((pdf) => {
              const itemKey = pdf._id || pdf.id;
              const fileLink = pdf.fileUrl || pdf.url;

              return (
                <div
                  key={itemKey}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/30 hover:border-slate-700/80 transition-all gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-10 h-12 rounded-lg bg-rose-950/40 border border-rose-800/50 flex flex-col items-center justify-center text-rose-400 shrink-0 shadow-inner">
                      <FileText size={18} />
                      <span className="text-[8px] font-black tracking-tighter uppercase text-rose-300 mt-0.5">
                        PDF
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-xs sm:text-sm font-bold text-white truncate hover:text-sky-300 transition-colors"
                        title={pdf.title}
                      >
                        {pdf.title || 'Untitled Document'}
                      </h4>

                      <div className="flex items-center gap-x-2.5 gap-y-0.5 text-[10.5px] text-slate-400 mt-0.5 flex-wrap">
                        <span className="text-sky-400 font-medium">
                          {pdf.category || 'Machinery Datasheet'}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">
                          {pdf.downloadCount || 0} downloads
                        </span>
                        <span className="text-slate-600">•</span>
                        <span
                          className={
                            pdf.active !== false ? 'text-emerald-400 font-semibold' : 'text-rose-400'
                          }
                        >
                          {pdf.active !== false ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {fileLink && (
                      <a
                        href={fileLink}
                        target="_blank"
                        rel="noreferrer"
                        title="View PDF"
                        className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => openEdit(pdf)}
                      title="Edit PDF"
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(itemKey)}
                      title="Delete PDF"
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upload/Edit Modal Dialog */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingPdf ? 'Edit PDF Document' : 'Upload Technical PDF'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your PDF file and provide title to upload to ImageKit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-4">
              {/* PDF File Picker Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  PDF File Attachment *
                </label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                    selectedFile
                      ? 'border-emerald-500/80 bg-emerald-950/20'
                      : 'border-slate-700 hover:border-sky-500 bg-slate-950/60 hover:bg-slate-950'
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex items-center gap-3 text-emerald-400 w-full justify-center">
                      <FileCheck size={28} className="shrink-0" />
                      <div className="text-left min-w-0">
                        <p className="text-xs font-bold truncate max-w-[260px] text-emerald-300">
                          {selectedFile.name}
                        </p>
                        <span className="text-[10.5px] text-slate-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file
                        </span>
                      </div>
                    </div>
                  ) : formData.fileUrl ? (
                    <div className="flex items-center gap-3 text-sky-400 w-full justify-center">
                      <FileText size={26} className="shrink-0" />
                      <div className="text-left min-w-0">
                        <p className="text-xs font-semibold truncate max-w-[260px] text-slate-200">
                          {formData.fileName || 'Existing PDF attached'}
                        </p>
                        <span className="text-[10px] text-sky-400 underline">
                          Click to browse and change PDF
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-2.5 rounded-full bg-slate-800 text-slate-400 group-hover:text-sky-400 group-hover:bg-sky-950 transition-colors">
                        <UploadCloud size={22} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-300">
                          Click to browse PDF file from your computer
                        </p>
                        <span className="text-[10px] text-slate-500">
                          Supported format: .pdf only (Up to 25MB)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. Atlas 420 Technical Datasheet"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              {/* Category & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
                  >
                    <option value="Machinery Datasheet">Machinery Datasheet</option>
                    <option value="Brochure">Brochure</option>
                    <option value="Technical Manual">Technical Manual</option>
                    <option value="Corporate Profile">Corporate Profile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Visibility Status
                  </label>
                  <select
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.value === 'true' })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brief Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional brief description of the document..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Uploading to ImageKit...</span>
                    </>
                  ) : (
                    <span>Save & Upload PDF</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}