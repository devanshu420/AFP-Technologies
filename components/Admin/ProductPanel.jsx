"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
} from "lucide-react";
import GearLoader from "../GearLoader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ProductPanel({ onProductCountChange }) {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchSummary() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("admin_jwt_token");

      const res = await fetch(`${API_BASE_URL}/products?limit=8`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      const json = await res.json();
      const list =
        json?.data?.products || (Array.isArray(json?.data) ? json.data : []);
      const total = json?.data?.pagination?.total ?? list.length;

      setProducts(list);
      setTotalCount(total);

      if (onProductCountChange) {
        onProductCountChange(total);
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <section className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-xl text-slate-100 flex flex-col justify-between transition-all">
      <div className="w-full flex flex-col flex-1">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3.5 mb-4 gap-3">
          {/* Left Title & Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  Product Catalog
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950 border border-sky-800/60 text-sky-400">
                  {totalCount} Total
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 mt-0.5 truncate">
                Manage industrial machinery, specifications & media
              </p>
            </div>
          </div>

          {/* Right Header Actions: See All Products + Refresh */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Top Right "See All Products" Button */}
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs hover:shadow-sky-900/40 transition-all cursor-pointer"
            >
              <span>See All Products</span>
              <ArrowRight size={13} className="shrink-0" />
            </Link>

            <button
              type="button"
              onClick={fetchSummary}
              disabled={loading}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 border border-slate-800 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
              title="Refresh machinery list"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin text-sky-400" : ""}
              />
            </button>
          </div>
        </div>

        {/* Live Machinery List */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Recent Equipment Catalog
            </span>
            <span className="text-[10px] text-slate-500">
              Showing top {products.length}
            </span>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/80">
              <GearLoader fullScreen={false} text="Loading Products..." />
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/80 px-4">
              <Layers
                size={24}
                className="mx-auto mb-2 text-slate-600 opacity-60"
              />
              <p className="font-semibold text-slate-400">
                No products found in database
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Click the button below to add your first machine.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80 bg-slate-950/40 rounded-xl border border-slate-800/80 overflow-hidden">
              {products.slice(0, 6).map((p) => {
                const imageUrl =
                  p.mainImage?.url || p.images?.[0]?.url || p.image || "";

                return (
                  <div
                    key={p._id || p.id}
                    className="flex items-center justify-between p-2.5 sm:p-3 hover:bg-slate-800/40 transition-colors text-xs gap-3"
                  >
                    {/* Thumbnail & Title */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-900 shrink-0 flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] text-slate-500 font-bold">
                            NA
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <strong className="text-slate-200 block truncate text-xs sm:text-[13px] font-semibold hover:text-sky-300 transition-colors">
                          {p.name || "Unnamed Machine"}
                        </strong>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="text-sky-400 font-medium truncate">
                            {p.category?.name ||
                              p.type ||
                              p.category ||
                              "Industrial System"}
                          </span>
                          {p.slug && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-500 truncate">
                                /{p.slug}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {p.active !== false ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                          <CheckCircle2 size={11} className="shrink-0" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/50 border border-rose-800/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                          <XCircle size={11} className="shrink-0" />
                          <span>Hidden</span>
                        </span>
                      )}

                      {/* View Link if slug exists */}
                      {p.slug && (
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          title="Preview Product Page"
                          className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-md transition-colors hidden sm:inline-flex"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
