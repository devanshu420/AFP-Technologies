'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProductPanel({ onProductCountChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchSummary() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products?limit=6`, {
        credentials: 'include',
      });
      const json = await res.json();
      const list = json?.data?.products || [];
      setProducts(list);

      if (onProductCountChange) {
        onProductCountChange(json?.data?.pagination?.total || list.length);
      }
    } catch {
      // silent fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <section className="w-full h-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-xl backdrop-blur-sm text-slate-100 flex flex-col justify-between transition-all">
      <div className="w-full flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 mb-3 sm:mb-4 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-sky-400 uppercase truncate">
                CATALOGUE MANAGEMENT
              </p>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
                Machinery & Equipment
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchSummary}
            disabled={loading}
            className="text-slate-400 hover:text-white p-1 sm:p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Info */}
        <p className="text-[11px] sm:text-xs text-slate-400 mb-3 sm:mb-4 leading-relaxed">
          Manage full engineering specifications, process flows, application
          lists, capacity ratings, and multi-image galleries.
        </p>

        {/* Live List Snippet */}
        <div className="space-y-2 mb-4 sm:mb-5 flex-1">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Recently Added Equipment
          </span>

          {loading ? (
            <div className="py-6 text-center text-xs text-slate-500 animate-pulse">
              Loading machinery snapshot...
            </div>
          ) : products.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 bg-slate-950/50 rounded-lg border border-slate-800/80 px-2">
              No products found in database.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80 bg-slate-950/40 rounded-lg border border-slate-800/80 overflow-hidden">
              {products.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-2 sm:p-2.5 hover:bg-slate-800/40 transition-colors text-xs gap-2"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <img
                      src={
                        p.mainImage?.url ||
                        p.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=120&q=80'
                      }
                      alt={p.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded object-cover border border-slate-700 bg-slate-900 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <strong className="text-slate-200 block truncate text-[11px] sm:text-xs font-semibold">
                        {p.name}
                      </strong>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">
                        {p.category?.name || 'Industrial System'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {p.active ? (
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-1.5 py-0.5 rounded whitespace-nowrap">
                        <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-rose-400 bg-rose-950/50 border border-rose-800/60 px-1.5 py-0.5 rounded whitespace-nowrap">
                        <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                        <span>Hidden</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <Link
        href="/admin/products"
        className="w-full inline-flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-[0.99] text-white text-xs font-bold transition-all shadow-lg shadow-sky-900/30 hover:shadow-sky-800/50 mt-auto"
      >
        <PlusCircle size={15} className="shrink-0" />
        <span className="truncate">Open Full Product Workspace</span>
        <ArrowRight size={14} className="ml-auto shrink-0" />
      </Link>
    </section>
  );
}