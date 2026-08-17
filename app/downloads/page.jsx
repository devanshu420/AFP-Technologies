'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Search,
  Loader2,
  ExternalLink,
  ArrowLeft,
  Briefcase,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DownloadsPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    async function loadPdfs() {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (category !== 'All') query.append('category', category);
        if (search.trim()) query.append('search', search.trim());

        const res = await fetch(`${API_BASE_URL}/downloads/public?${query.toString()}`, {
          cache: 'no-store',
        });
        const json = await res.json();

        const pdfList = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : json?.data?.data || [];

        setPdfs(pdfList);
      } catch (err) {
        console.error('Failed to load downloads:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadPdfs();
    }, 300);

    return () => clearTimeout(timer);
  }, [category, search]);

  const handleDownload = async (pdf) => {
    const pdfId = pdf._id || pdf.id;
    try {
      setDownloadingId(pdfId);
      fetch(`${API_BASE_URL}/downloads/track/${pdfId}`, { method: 'POST' });

      const response = await fetch(pdf.fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${(pdf.title || 'document').replace(/\s+/g, '-')}-afptech.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(pdf.fileUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const categories = [
    'All',
    'Machinery Datasheet',
    'Brochure',
    'Technical Manual',
    'Corporate Profile',
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* ─── Top Utility Navigation Bar ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all shadow-xs group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </Link>

    
        </div>

        {/* ─── Modern Professional Hero Banner ─── */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              <Briefcase size={12} className="text-slate-500" />
              Document Portal
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Machinery Specifications & Datasheets
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl pt-1">
              Download technical brochures, blueprints, performance ratings, and engineering manuals for industrial machinery.
            </p>
          </div>
        </div>

        {/* ─── Search & Category Filter Toolbar ─── */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 shadow-xs space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
          {/* Scrollable Category Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  category === cat
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>
        </div>

        {/* ─── Main Content Area ─── */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
              <Loader2 className="animate-spin text-sky-600" size={30} />
              <p className="text-xs font-semibold text-slate-500">Loading documents library...</p>
            </div>
          ) : pdfs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-3">
                <FileText size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No datasheets available</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                No active document matches your current search term or filter category.
              </p>
            </div>
          ) : (
            <>
              {/* ─── DESKTOP TABLE VIEW (Visible on sm & up) ─── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-5 w-12 text-center">#</th>
                      <th className="py-4 px-5">Document / Machine</th>
                      <th className="py-4 px-5">Category</th>
                      <th className="py-4 px-5 hidden md:table-cell">Format</th>
                      <th className="py-4 px-5 hidden lg:table-cell text-center">Downloads</th>
                      <th className="py-4 px-5 text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {pdfs.map((pdf, index) => {
                      const itemKey = pdf._id || pdf.id;
                      return (
                        <tr
                          key={itemKey}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="py-4 px-5 text-center text-slate-400 font-mono text-[11px]">
                            {String(index + 1).padStart(2, '0')}
                          </td>
                          <td className="py-4 px-5 max-w-sm">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:scale-105 transition-transform">
                                <FileText size={16} />
                              </div>
                              <div className="min-w-0">
                                <h2 className="font-bold text-slate-800 text-sm group-hover:text-sky-700 transition-colors truncate">
                                  {pdf.title}
                                </h2>
                                {pdf.description && (
                                  <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5 leading-relaxed">
                                    {pdf.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-100">
                              {pdf.category || 'General'}
                            </span>
                          </td>
                          <td className="py-4 px-5 hidden md:table-cell">
                            <span className="text-slate-500 font-mono text-[11px]">
                              PDF Spec
                            </span>
                          </td>
                          <td className="py-4 px-5 hidden lg:table-cell text-center">
                            <span className="text-slate-600 text-[11px] font-mono bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                              {pdf.downloadCount || 0}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right pr-6">
                            <div className="inline-flex items-center gap-2 justify-end">
                              <a
                                href={pdf.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open in browser"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all shadow-2xs"
                              >
                                <ExternalLink size={12} />
                                <span>View</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDownload(pdf)}
                                disabled={downloadingId === itemKey}
                                title="Download PDF"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:bg-sky-400 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs shadow-sky-600/20 cursor-pointer"
                              >
                                {downloadingId === itemKey ? (
                                  <>
                                    <Loader2 size={12} className="animate-spin" />
                                    <span>Saving...</span>
                                  </>
                                ) : (
                                  <>
                                    <Download size={12} />
                                    <span>Download</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ─── MOBILE CARD VIEW (Visible only on < sm) ─── */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {pdfs.map((pdf, index) => {
                  const itemKey = pdf._id || pdf.id;
                  return (
                    <div key={itemKey} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-100">
                              {pdf.category || 'General'}
                            </span>
                            <span className="text-slate-400 text-[10px] font-mono">
                              #{String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <h2 className="font-bold text-slate-800 text-xs sm:text-sm mt-1 leading-snug">
                            {pdf.title}
                          </h2>
                          {pdf.description && (
                            <p className="text-slate-500 text-[11px] line-clamp-2 mt-1 leading-relaxed">
                              {pdf.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Mobile Action Buttons (Full Width Touch-Friendly) */}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={pdf.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs"
                        >
                          <ExternalLink size={13} />
                          <span>View PDF</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDownload(pdf)}
                          disabled={downloadingId === itemKey}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-sky-600 active:bg-sky-700 disabled:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-xs shadow-sky-600/20"
                        >
                          {downloadingId === itemKey ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Download size={13} />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ─── Footer Section ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] border-t border-slate-200 pt-4 px-1 gap-2 pb-6">
          <span>Active Specifications: {pdfs.length} files available</span>
          <span>AFP Technologies Machinery Documentation © {new Date().getFullYear()}</span>
        </div>

      </div>
    </div>
  );
}