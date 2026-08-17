'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowRight,
  PlusCircle,
  Package,
  RefreshCw,
  Eye,
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
    <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl backdrop-blur-sm text-slate-100 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-sky-400 uppercase">
                CATALOGUE MANAGEMENT
              </p>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Machinery & Equipment
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchSummary}
            disabled={loading}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh list"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Quick Info & Stats */}
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Manage full engineering specifications, process flows, application
          lists, capacity ratings, and multi-image galleries.
        </p>

        {/* Live List Snippet */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Recently Added Equipment
          </span>

          {loading ? (
            <div className="py-6 text-center text-xs text-slate-500 animate-pulse">
              Loading machinery snapshot...
            </div>
          ) : products.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 bg-slate-950/50 rounded-lg border border-slate-800/80">
              No products found in database.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80 bg-slate-950/40 rounded-lg border border-slate-800/80 overflow-hidden">
              {products.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-2.5 hover:bg-slate-800/40 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={
                        p.mainImage?.url ||
                        p.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=120&q=80'
                      }
                      alt={p.name}
                      className="w-7 h-7 rounded object-cover border border-slate-700 bg-slate-900 shrink-0"
                    />
                    <div className="truncate">
                      <strong className="text-slate-200 block truncate text-xs">
                        {p.name}
                      </strong>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {p.category?.name || 'Industrial System'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {p.active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                        <CheckCircle2 size={10} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/50 border border-rose-800/60 px-1.5 py-0.5 rounded">
                        <XCircle size={10} /> Hidden
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button -> Redirects to Full Screen Workspace */}
      <Link
        href="/admin/products"
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-900/30 hover:shadow-sky-800/50"
      >
        <PlusCircle size={15} />
        <span>Open Full Product Workspace</span>
        <ArrowRight size={14} className="ml-auto" />
      </Link>
    </section>
  );
}