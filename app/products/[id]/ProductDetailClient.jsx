"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Home,
  ChevronDown,
  ChevronLeft,
  MessageCircle,
  Mail,
  Layers,
  FileDown,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";

export default function ProductDetailClient({
  currentId,
  initialProduct,
  allProducts = [],
}) {
  const router = useRouter();
  const product = initialProduct;

  // 1. Process & Normalize Gallery Images
  const galleryImages = useMemo(() => {
    const list = [];

    if (Array.isArray(product?.images) && product.images.length > 0) {
      product.images.forEach((img, idx) => {
        const url = typeof img === "string" ? img : img?.url;
        if (url) {
          list.push({
            url,
            alt: img?.alt || `${product.name} - View ${idx + 1}`,
          });
        }
      });
    }

    if (product?.mainImage?.url) {
      const exists = list.some((i) => i.url === product.mainImage.url);
      if (!exists) {
        list.unshift({
          url: product.mainImage.url,
          alt: product.mainImage.alt || product.name,
        });
      }
    }

    if (list.length === 0) {
      list.push({
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=85",
        alt: product?.name || "Industrial Machinery Equipment",
      });
    }

    return list;
  }, [product]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = galleryImages[selectedIndex] || galleryImages[0];
  const whatsappNumber = "919876543210";

  const handlePrevImage = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setSelectedIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  };

  // 2. Capacities Extraction
  const capacityList = useMemo(() => {
    if (Array.isArray(product?.capacities) && product.capacities.length > 0) {
      return product.capacities;
    }
    if (
      product?.capacity &&
      typeof product.capacity === "string" &&
      product.capacity.trim() !== ""
    ) {
      return [product.capacity];
    }
    return [];
  }, [product]);

  // 3. Process Steps Extraction
  const processSteps = useMemo(() => {
    if (Array.isArray(product?.processFlow) && product.processFlow.length > 0) {
      return product.processFlow;
    }
    return [];
  }, [product]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased pb-12 text-[12px]">
      {/* ─── 1. COMPACT BREADCRUMBS ─── */}
      <div className="bg-white border-b border-slate-200 py-1.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav
            className="flex items-center gap-1 text-[11px] text-slate-500"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-sky-700 font-medium"
            >
              <Home size={11} /> Home
            </Link>
            <ChevronRight size={10} className="text-slate-400" />
            <Link
              href="/#products"
              className="text-slate-600 hover:text-sky-700 font-medium"
            >
              Products
            </Link>
            {product.category?.name && (
              <>
                <ChevronRight size={10} className="text-slate-400" />
                <span className="text-slate-500 truncate max-w-[120px]">
                  {product.category.name}
                </span>
              </>
            )}
            <ChevronRight size={10} className="text-slate-400" />
            <span className="text-sky-800 font-semibold truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── MOBILE PRODUCT SWITCHER (< 1024px) ─── */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <label
            htmlFor="mobile-prod-select"
            className="block text-[10px] font-bold uppercase tracking-wider text-sky-800 mb-1"
          >
            Select Machinery Line:
          </label>
          <div className="relative">
            <select
              id="mobile-prod-select"
              value={product.slug || product._id}
              onChange={(e) => router.push(`/products/${e.target.value}`)}
              className="w-full bg-slate-50 border border-slate-300 rounded py-1 px-2.5 pr-8 text-[11px] font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600 appearance-none cursor-pointer"
            >
              {allProducts.map((p) => {
                const id = p.slug || p._id;
                return (
                  <option key={id} value={id}>
                    {p.name}
                  </option>
                );
              })}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN 3-COLUMN INDUSTRIAL LAYOUT ─── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_195px] gap-4 items-start">
          {/* ─── COLUMN 1: LEFT SIDEBAR (Products & Applications) ─── */}
          <aside className="hidden lg:block lg:sticky lg:top-20">
            <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
              {/* Sidebar Header */}
              <div className="bg-sky-800 border-b border-sky-900 px-3 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers size={15} className="text-sky-200" />

                  <h3 className="text-[17px] font-bold tracking-wide text-white uppercase">
                    Products & Applications
                  </h3>
                </div>
              </div>

              {/* Product List */}
              <nav className="max-h-[calc(100vh-140px)] overflow-y-auto divide-y divide-slate-100">
                <ul className="list-none m-0 p-0">
                  {allProducts.map((p) => {
                    const targetKey = p.slug || p._id;

                    const isActive =
                      targetKey === product.slug ||
                      targetKey === product._id ||
                      p._id === currentId ||
                      p.slug === currentId;

                    return (
                      <li key={p._id || p.slug}>
                        <Link
                          href={`/products/${targetKey}`}
                          className={`group flex items-start gap-2 px-3 py-2.5 text-[14px] leading-snug transition-colors border-l-2 ${
                            isActive
                              ? "bg-sky-50 text-sky-900 font-bold border-sky-700"
                              : "text-slate-700 hover:text-sky-700 hover:bg-slate-50 border-transparent font-normal"
                          }`}
                        >
                          {/* Arrow */}
                          <span
                            className={`text-sm leading-none mt-0.5 shrink-0 ${
                              isActive
                                ? "text-sky-700 font-black"
                                : "text-slate-400 group-hover:text-sky-600"
                            }`}
                          >
                            »
                          </span>

                          {/* Product Name */}
                          <span className="flex-1">{p.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          {/* ─── COLUMN 2: CENTER PRODUCT DETAILS ─── */}
          <main className="min-w-0 bg-white border border-slate-300 rounded p-4 sm:p-5 shadow-sm">
            {/* Title & Badge */}
           <div className="border-b border-slate-200 pb-3 mb-4">
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
    
    {/* 1. Product Information (Left) */}
    <div className="flex flex-col items-start min-w-0 flex-1">
      {product.category?.name && (
        <span className="inline-block bg-sky-100 text-sky-800 text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mb-1">
          {product.category.name}
        </span>
      )}

      <h1 className="text-[20px] sm:text-[24px] font-bold text-slate-900 tracking-tight leading-snug">
        {product.name}
      </h1>

      {product.shortDescription && (
        <p className="mt-1 text-[12.5px] text-slate-600 leading-relaxed max-w-2xl">
          {product.shortDescription}
        </p>
      )}
    </div>

    {/* 2. PDF Floating Compact Widget (Right) */}
    {product.pdf?.url && (
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
            // PDF name format: "[OriginalName]-afptechnologies.pdf"
            const rawName = (product.pdf.name || product.slug || product.name || 'machinery-specification')
              .replace(/\.pdf$/i, '')
              .trim()
              .replace(/\s+/g, '-');
            const downloadFileName = `${rawName}-afptechnologies.pdf`;

            return (
              <a
                href={`${product.pdf.url}${
                  product.pdf.url.includes('?') ? '&' : '?'
                }ik-attachment=true&response-content-disposition=attachment;filename=${encodeURIComponent(
                  downloadFileName
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

  </div>
</div>

            {/* Product Image Gallery Frame */}
            <div className="border border-slate-200 rounded p-1.5 bg-slate-50 mb-4">
              <div className="relative w-full aspect-[16/9] max-h-[320px] bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                <img
                  src={activeImage.url}
                  alt={activeImage.alt}
                  className="w-full h-full object-contain block"
                />

                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-sky-700 hover:text-white text-slate-700 p-1 rounded shadow-sm border border-slate-300"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-sky-700 hover:text-white text-slate-700 p-1 rounded shadow-sm border border-slate-300"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails row */}
              {galleryImages.length > 1 && (
                <div className="flex gap-1.5 mt-2 overflow-x-auto pb-0.5">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className={`relative w-14 h-9 rounded border flex-shrink-0 overflow-hidden bg-slate-100 ${
                        selectedIndex === idx
                          ? "border-sky-700 ring-1 ring-sky-600 opacity-100"
                          : "border-slate-300 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <div className="bg-slate-50 border border-slate-200 border-t-2 border-t-sky-700 rounded p-2">
                <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                  Automation
                </span>
                <strong className="text-[11px] font-bold text-slate-900">
                  {product.automationType || "Fully Automatic"}
                </strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 border-t-2 border-t-sky-700 rounded p-2">
                <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                  Material Grade
                </span>
                <strong className="text-[11px] font-bold text-slate-900">
                  {product.material || "AISI 304 Stainless"}
                </strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 border-t-2 border-t-sky-700 rounded p-2">
                <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                  Warranty Support
                </span>
                <strong className="text-[11px] font-bold text-slate-900">
                  {product.warranty || "OEM Warranty"}
                </strong>
              </div>
            </div>

            {/* Detailed Description */}
            {product.description && (
              <section className="mb-4">
                <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                  Product Description
                </h3>
                <div className="text-[11.5px] text-slate-700 leading-relaxed space-y-1.5">
                  <p>{product.description}</p>
                  {product.detailedDescription && (
                    <p>{product.detailedDescription}</p>
                  )}
                </div>
              </section>
            )}

            {/* Standard Capacities */}
            {capacityList.length > 0 && (
              <section className="mb-4">
                <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                  Standard Capacities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                  {capacityList.map((cap, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] font-medium text-slate-800 flex items-center gap-1.5"
                    >
                      <span className="text-sky-700 font-bold">•</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Applications List */}
            {((Array.isArray(product.applications) &&
              product.applications.length > 0) ||
              product.application) && (
              <section className="mb-4">
                <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                  Applications
                </h3>
                {Array.isArray(product.applications) &&
                product.applications.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {product.applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded p-2"
                      >
                        <strong className="text-[11px] font-bold text-sky-900 block">
                          » {typeof app === "string" ? app : app.title}
                        </strong>
                        {app.description && (
                          <p className="text-[10.5px] text-slate-600 leading-normal mt-0.5">
                            {app.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    {product.application}
                  </p>
                )}
              </section>
            )}

            {/* Advantages & Features Split */}
            {((Array.isArray(product.advantages) &&
              product.advantages.length > 0) ||
              (Array.isArray(product.features) &&
                product.features.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4">
                {/* Advantages */}
                {Array.isArray(product.advantages) &&
                  product.advantages.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                      <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                        Advantages
                      </h3>
                      <ul className="space-y-1 list-none p-0 m-0">
                        {product.advantages.map((adv, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight"
                          >
                            <span className="text-sky-700 font-extrabold">
                              »
                            </span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Features */}
                {Array.isArray(product.features) &&
                  product.features.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                      <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                        Key Features
                      </h3>
                      <ul className="space-y-1.5 list-none p-0 m-0">
                        {product.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight"
                          >
                            <span className="text-emerald-700 font-extrabold">
                              »
                            </span>
                            <div>
                              <strong className="text-slate-900">
                                {typeof feat === "string" ? feat : feat.title}
                              </strong>
                              {feat.description && (
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {feat.description}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Technical Specifications Table */}
            {((Array.isArray(product.specifications) &&
              product.specifications.length > 0) ||
              product.power ||
              product.dimensions ||
              product.material) && (
              <section className="mb-4">
                <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                  Technical Specifications
                </h3>
                <div className="border border-slate-300 rounded overflow-hidden">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <tbody className="divide-y divide-slate-200">
                      {product.power && (
                        <tr className="even:bg-slate-50">
                          <th className="py-1.5 px-2.5 font-semibold text-slate-600 w-1/3 border-r border-slate-200">
                            Power
                          </th>
                          <td className="py-1.5 px-2.5 text-slate-900 font-medium">
                            {product.power}
                          </td>
                        </tr>
                      )}
                      {product.dimensions && (
                        <tr className="even:bg-slate-50">
                          <th className="py-1.5 px-2.5 font-semibold text-slate-600 w-1/3 border-r border-slate-200">
                            Dimensions
                          </th>
                          <td className="py-1.5 px-2.5 text-slate-900 font-medium">
                            {product.dimensions}
                          </td>
                        </tr>
                      )}
                      {product.material && (
                        <tr className="even:bg-slate-50">
                          <th className="py-1.5 px-2.5 font-semibold text-slate-600 w-1/3 border-r border-slate-200">
                            Material
                          </th>
                          <td className="py-1.5 px-2.5 text-slate-900 font-medium">
                            {product.material}
                          </td>
                        </tr>
                      )}
                      {Array.isArray(product.specifications) &&
                        product.specifications.map((spec, idx) => (
                          <tr key={idx} className="even:bg-slate-50">
                            <th className="py-1.5 px-2.5 font-semibold text-slate-600 w-1/3 border-r border-slate-200">
                              {spec.key || spec.title}
                            </th>
                            <td className="py-1.5 px-2.5 text-slate-900 font-medium">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Brochure Link */}
            {product.pdf?.url && (
              <div className="mb-4">
                <a
                  href={product.pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-[10.5px] font-bold rounded"
                >
                  <FileText size={13} />
                  <span>
                    Download Technical Datasheet (
                    {product.pdf.name || "PDF Data"})
                  </span>
                </a>
              </div>
            )}

            {/* Compact Bottom Inquiry Panel */}
            <div className="bg-slate-50 border border-slate-300 rounded p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
              <div>
                <h3 className="text-[11.5px] font-bold text-slate-900">
                  Need Engineering Layout & Quotation?
                </h3>
                <p className="text-[10.5px] text-slate-500">
                  Contact our sales engineering team for formal proposals.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hello, I would like to get technical specifications and a quotation for: ${product.name}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-600 hover:text-white border border-emerald-600 text-emerald-700 text-[10.5px] font-bold rounded shadow-sm"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white text-[10.5px] font-bold rounded shadow-sm"
                >
                  <Mail size={13} /> Request Quote
                </Link>
              </div>
            </div>
          </main>

          {/* ─── COLUMN 3: RIGHT SIDEBAR (Process Flow) ─── */}
          {processSteps.length > 0 && (
            <aside className="sticky top-20">
              <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
                <div className="bg-slate-800 border-b border-slate-900 px-3 py-2">
                  <h3 className="text-[21.5px] font-bold tracking-wider text-white uppercase">
                    Process Flow
                  </h3>
                </div>
                <ol className="divide-y divide-slate-100 list-none p-0 m-0">
                  {processSteps.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-[10.5px] font-medium text-slate-700 leading-tight">
                        {typeof step === "string" ? step : step.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
