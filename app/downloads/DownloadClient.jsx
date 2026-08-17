"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  ChevronRight,
  Home,
  Layers,
  ArrowRight,
  FileCheck,
} from "lucide-react";

export default function DownloadClient({
  initialDownloads = [],
  categories = [],
}) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");

  const filteredItems = useMemo(() => {
    return initialDownloads.filter((item) => {
      const matchCat =
        selectedCat === "ALL" ||
        item.categoryName.toLowerCase() === selectedCat.toLowerCase();
      const matchSearch =
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.displayName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [initialDownloads, search, selectedCat]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased pb-20 text-[12px] font-sans">
      {/* ─── Breadcrumb Bar ─── */}
      <div className="bg-white border-b border-slate-200 py-2 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav
            className="flex items-center gap-1.5 text-[11px] text-slate-500"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-sky-700 font-medium"
            >
              <Home size={11} /> Home
            </Link>
            <ChevronRight size={11} className="text-slate-400" />
            <span className="text-sky-800 font-semibold">
              Technical Brochures & Downloads
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* ─── Header Card ─── */}
        <div className="bg-white border border-slate-300 rounded p-4 sm:p-5 shadow-2xs mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-block bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                OEM Engineering Documentation
              </span>
            </div>
            <h1 className="text-[18px] sm:text-[22px] font-bold text-slate-900 tracking-tight leading-tight">
              Machinery Product Brochures & Datasheets
            </h1>
            <p className="text-[11.5px] text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Access and download official technical datasheets, dimension
              diagrams, and operational specifications for our complete
              industrial processing lines.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto bg-slate-50 border border-slate-200 rounded px-3 py-2">
            <FileCheck size={18} className="text-sky-700" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                Total Documents
              </span>
              <strong className="text-xs font-bold text-slate-900">
                {initialDownloads.length} PDF Brochures
              </strong>
            </div>
          </div>
        </div>

        {/* ─── Search & Category Filters Bar ─── */}
        <div className="bg-white border border-slate-300 rounded p-3 shadow-2xs mb-4 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search machinery by name or document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">
              Category:
            </span>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-600 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ─── Documents Table List ─── */}
        <div className="bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <FileText size={28} className="mx-auto text-slate-300 mb-2" />
              <strong className="block text-xs font-semibold text-slate-700">
                No PDF Brochures Found
              </strong>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Try adjusting your keyword query or selected category filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-sky-800 border-b border-sky-900 text-white text-[10.5px] uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-3.5 w-12 text-center">#</th>
                    <th className="py-2.5 px-3.5">Equipment & Line</th>
                    <th className="py-2.5 px-3.5 hidden md:table-cell">
                      Category
                    </th>
                    <th className="py-2.5 px-3.5">Document File</th>
                    <th className="py-2.5 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredItems.map((item, idx) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* # Index */}
                      <td className="py-2.5 px-3.5 text-center text-slate-400 text-[11px] font-semibold">
                        {idx + 1}
                      </td>

                      {/* Equipment Name */}
                      <td className="py-2.5 px-3.5">
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-bold text-slate-900 hover:text-sky-700 text-xs inline-flex items-center gap-1 group"
                        >
                          <span>{item.productName}</span>
                          <ArrowRight
                            size={11}
                            className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                          />
                        </Link>
                        <span className="block text-[10px] text-slate-500 md:hidden mt-0.5">
                          {item.categoryName}
                        </span>
                      </td>

                      {/* Category Tag */}
                      <td className="py-2.5 px-3.5 hidden md:table-cell">
                        <span className="inline-block bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {item.categoryName}
                        </span>
                      </td>

                      {/* ─── PDF Floating Compact Widget ─── */}
                      {Boolean(
                        product?.pdf?.url && product.pdf.url.trim() !== "",
                      ) && (
                        <div className="shrink-0 self-start sm:self-auto bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-md p-1.5 flex items-center gap-2 shadow-sm transition-all">
                          {/* PDF Icon & Label */}
                          <div className="flex items-center gap-1.5 pl-0.5">
                            <div className="w-6 h-6 rounded bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                              <FileText size={13} />
                            </div>
                            <div className="hidden md:block">
                              <span className="text-[10px] font-bold text-slate-800 block leading-none">
                                Datasheet
                              </span>
                              <span className="text-[8.5px] text-slate-400 block leading-none mt-0.5">
                                PDF Spec
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {/* View in Browser */}
                            <a
                              href={product.pdf.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View PDF in new tab"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-semibold rounded shadow-2xs transition-colors whitespace-nowrap"
                            >
                              <ExternalLink size={11} />
                              <span>View</span>
                            </a>

                            {/* Download Trigger */}
                            {(() => {
                              const rawName = (
                                product.pdf.name ||
                                product.slug ||
                                product.name ||
                                "machinery-specification"
                              )
                                .replace(/\.pdf$/i, "")
                                .trim()
                                .replace(/\s+/g, "-");
                              const downloadFileName = `${rawName}-afptechnologies.pdf`;

                              return (
                                <a
                                  href={`${product.pdf.url}${
                                    product.pdf.url.includes("?") ? "&" : "?"
                                  }ik-attachment=true&response-content-disposition=attachment;filename=${encodeURIComponent(
                                    downloadFileName,
                                  )}`}
                                  download={downloadFileName}
                                  title={`Download ${downloadFileName}`}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-sky-700 hover:bg-sky-800 text-white text-[10px] font-bold rounded shadow-2xs transition-colors whitespace-nowrap"
                                >
                                  <Download size={11} />
                                  <span>Download</span>
                                </a>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
