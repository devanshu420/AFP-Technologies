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
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Utility Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all shadow-xs group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Hero Banner */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs">
  <div className="max-w-3xl space-y-1">
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
      <Briefcase size={11} className="text-slate-500" />
      Document Portal
    </div>
    <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">
      Machinery Specifications & Datasheets
    </h1>
    <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed max-w-2xl">
      Download technical brochures, blueprints, performance ratings, and engineering manuals for industrial machinery.
    </p>
  </div>
</div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 shadow-xs space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
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

        {/* Main Content Area: 4 Compact PDFs per row Grid */}
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3 bg-white rounded-3xl border border-slate-200/80">
              <Loader2 className="animate-spin text-sky-600" size={30} />
              <p className="text-xs font-semibold text-slate-500">Loading documents library...</p>
            </div>
          ) : pdfs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-white rounded-3xl border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-3">
                <FileText size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No datasheets available</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                No active document matches your current search term or filter category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pdfs.map((pdf) => {
                const itemKey = pdf._id || pdf.id;

                return (
                  <div
                    key={itemKey}
                    className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Compact PDF Vector Banner Preview (Height reduced to h-24) */}
                    <div className="relative h-24 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-slate-100 overflow-hidden flex flex-col items-center justify-center text-rose-400 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-7 h-9 rounded bg-rose-950/80 border border-rose-700/60 flex flex-col items-center justify-center shadow-xs">
                        <FileText size={15} className="text-rose-300" />
                        <span className="text-[7px] font-black tracking-tighter uppercase text-rose-200">
                          PDF
                        </span>
                      </div>

                      {/* Top Overlay Badges */}
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 shadow-2xs border border-slate-200">
                          {pdf.category || 'Datasheet'}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900/80 text-slate-200">
                          <Download size={9} />
                          {pdf.downloadCount || 0}
                        </span>
                      </div>
                    </div>

                    {/* Card Body: Compact Title & Details */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                      <div className="space-y-1">
                        {/* Smaller & Cleaner PDF Title Font */}
                        <h3 className="font-bold text-slate-900 text-xs group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug" title={pdf.title}>
                          {pdf.title}
                        </h3>
                        <p className="text-slate-500 text-[10.5px] line-clamp-1 leading-relaxed">
                          {pdf.description || 'Industrial engineering technical specification document.'}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <a
                          href={pdf.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10.5px] font-semibold transition-all shadow-2xs"
                        >
                          <ExternalLink size={11} className="text-slate-500" />
                          <span>View</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDownload(pdf)}
                          disabled={downloadingId === itemKey}
                          className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:bg-sky-400 text-white rounded-lg text-[10.5px] font-bold transition-all shadow-2xs shadow-sky-600/20 cursor-pointer"
                        >
                          {downloadingId === itemKey ? (
                            <>
                              <Loader2 size={11} className="animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Download size={11} />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] border-t border-slate-200 pt-4 px-1 gap-2 pb-6">
          <span>Active Specifications: {pdfs.length} files available</span>
          <span>AFP Technologies Machinery Documentation © {new Date().getFullYear()}</span>
        </div>

      </div>
    </div>
  );
}