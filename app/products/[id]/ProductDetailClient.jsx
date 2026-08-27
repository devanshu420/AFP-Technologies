"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  FileText,
  Download,
  ExternalLink,
  Share2,
  Plus,
  Minus,
} from "lucide-react";

export default function ProductDetailClient({
  currentId,
  initialProduct,
  allProducts = [],
}) {
  const router = useRouter();
  const product = initialProduct;

  // =========================================================
  // IMAGE PREVIEW
  // =========================================================

  const [previewImage, setPreviewImage] = useState(null);

  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  const previewRef = useRef(null);
  const sourceRef = useRef(null);

  // =========================================================
  // GALLERY
  // =========================================================

  const galleryImages = useMemo(() => {
    const list = [];

    if (
      Array.isArray(product?.images) &&
      product.images.length > 0
    ) {
      product.images.forEach((img, idx) => {
        const url =
          typeof img === "string"
            ? img
            : img?.url;

        if (url) {
          list.push({
            url,
            alt:
              typeof img === "string"
                ? `${product.name} - View ${idx + 1}`
                : img?.alt ||
                  `${product.name} - View ${idx + 1}`,
          });
        }
      });
    }

    if (product?.mainImage?.url) {
      const exists = list.some(
        (item) =>
          item.url === product.mainImage.url
      );

      if (!exists) {
        list.unshift({
          url: product.mainImage.url,
          alt:
            product.mainImage.alt ||
            product.name,
        });
      }
    }

    if (list.length === 0) {
      list.push({
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=85",
        alt:
          product?.name ||
          "Industrial Machinery Equipment",
      });
    }

    return list;
  }, [product]);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const activeImage =
    galleryImages[selectedIndex] ||
    galleryImages[0];

  const whatsappNumber = "919876543210";

  // =========================================================
  // GALLERY NAVIGATION
  // =========================================================

  const handlePrevImage = () => {
    setSelectedIndex((prev) =>
      prev === 0
        ? galleryImages.length - 1
        : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedIndex((prev) =>
      prev === galleryImages.length - 1
        ? 0
        : prev + 1
    );
  };

  // =========================================================
  // OPEN IMAGE PREVIEW
  // IMPORTANT:
  // sourceElement is the ACTUAL IMAGE element.
  // =========================================================

  const openImagePreview = (
    image,
    sourceElement
  ) => {
    if (!image?.url || !sourceElement) return;

    sourceRef.current = sourceElement;

    setPreviewImage({
      url: image.url,
      alt:
        image.alt ||
        product?.name ||
        "Equipment",
    });

    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  // =========================================================
  // CLOSE IMAGE PREVIEW
  // =========================================================

  const closeImagePreview = () => {
    setPreviewImage(null);

    sourceRef.current = null;

    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  // =========================================================
  // PREVIEW MOUSE MOVE / ZOOM
  // =========================================================

  const handlePreviewMouseMove = (e) => {
    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) *
      100;

    const y =
      ((e.clientY - rect.top) / rect.height) *
      100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  // =========================================================
  // KEEP PREVIEW OPEN BETWEEN SOURCE + PREVIEW
  //
  // Preview stays open when mouse is:
  // 1. On actual source image
  // 2. Inside large preview
  //
  // It closes when mouse leaves BOTH.
  // =========================================================

  useEffect(() => {
    if (!previewImage) return;

    const handleMouseMove = (e) => {
      const previewElement =
        previewRef.current;

      const sourceElement =
        sourceRef.current;

      if (!previewElement) return;

      // -----------------------------------------
      // Check large preview
      // -----------------------------------------

      const previewRect =
        previewElement.getBoundingClientRect();

      const isInsidePreview =
        e.clientX >= previewRect.left &&
        e.clientX <= previewRect.right &&
        e.clientY >= previewRect.top &&
        e.clientY <= previewRect.bottom;

      // -----------------------------------------
      // Check ACTUAL IMAGE
      // -----------------------------------------

      let isInsideSource = false;

      if (sourceElement) {
        const sourceRect =
          sourceElement.getBoundingClientRect();

        isInsideSource =
          e.clientX >= sourceRect.left &&
          e.clientX <= sourceRect.right &&
          e.clientY >= sourceRect.top &&
          e.clientY <= sourceRect.bottom;
      }

      // -----------------------------------------
      // Close only when outside both
      // -----------------------------------------

      if (
        !isInsidePreview &&
        !isInsideSource
      ) {
        closeImagePreview();
      }
    };

    document.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, [previewImage]);

  // =========================================================
  // CAPACITIES
  // =========================================================

  const capacityList = useMemo(() => {
    if (
      Array.isArray(product?.capacities) &&
      product.capacities.length > 0
    ) {
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

  // =========================================================
  // PROCESS STEPS
  // =========================================================

  const processSteps = useMemo(() => {
    if (
      Array.isArray(product?.processFlow) &&
      product.processFlow.length > 0
    ) {
      return product.processFlow;
    }

    return [];
  }, [product]);

  // =========================================================
  // CATEGORY HELPERS
  // =========================================================

  const getCategoryId = (item) => {
    if (!item) return null;

    if (
      typeof item.category === "object"
    ) {
      return (
        item.category?._id ||
        item.category?.id ||
        null
      );
    }

    return item.category || null;
  };

  const currentCategoryId =
    getCategoryId(product);

  // =========================================================
  // GROUP PRODUCTS CATEGORY-WISE
  // =========================================================

  const productsByCategory = useMemo(() => {
    const grouped = {};

    allProducts.forEach((p) => {
      const categoryId =
        getCategoryId(p);

      if (!categoryId) return;

      const key = String(categoryId);

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(p);
    });

    return grouped;
  }, [allProducts]);

  // =========================================================
  // EXPANDED CATEGORY
  // =========================================================

  const [expandedCategory, setExpandedCategory] =
    useState(
      currentCategoryId
        ? String(currentCategoryId)
        : null
    );

  // =========================================================
  // CATEGORY CLICK
  // =========================================================

  const handleCategoryClick = (
    categoryId
  ) => {
    const id = String(categoryId);

    setExpandedCategory((prev) =>
      prev === id ? null : id
    );
  };

  // =========================================================
  // MOBILE PRODUCT SWITCHER
  // =========================================================

  const currentProductValue =
    product.slug || product._id;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased pb-12 text-[12px]">

      {/* =====================================================
          BREADCRUMBS
      ===================================================== */}

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
              <Home size={11} />
              Home
            </Link>

            <ChevronRight
              size={10}
              className="text-slate-400"
            />

            <Link
              href="/#products"
              className="text-slate-600 hover:text-sky-700 font-medium"
            >
              Products
            </Link>

            {product.category?.name && (
              <>
                <ChevronRight
                  size={10}
                  className="text-slate-400"
                />

                <span className="text-slate-500 truncate max-w-[120px]">
                  {product.category.name}
                </span>
              </>
            )}

            <ChevronRight
              size={10}
              className="text-slate-400"
            />

            <span className="text-sky-800 font-semibold truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* =====================================================
          MOBILE PRODUCT SWITCHER
      ===================================================== */}

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
              value={currentProductValue}
              onChange={(e) =>
                router.push(
                  `/products/${e.target.value}`
                )
              }
              className="w-full bg-slate-50 border border-slate-300 rounded py-1 px-2.5 pr-8 text-[11px] font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600 appearance-none cursor-pointer"
            >
              {allProducts.map((p) => {
                const id =
                  p.slug || p._id;

                return (
                  <option
                    key={id}
                    value={id}
                  >
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

      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 mt-4">

        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_195px] gap-4 items-start">

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <aside className="hidden lg:block lg:sticky lg:top-20">

            <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">

              <div className="bg-sky-800 border-b border-sky-900 px-3 py-2.5 flex items-center gap-1.5">
                <Layers
                  size={15}
                  className="text-sky-200"
                />

                <h3 className="text-[13px] font-bold tracking-wide text-white uppercase">
                  Products & Applications
                </h3>
              </div>

              <div className="max-h-[430px] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">

                <ul className="list-none m-0 p-0">

                  {allProducts.length === 0 ? (
                    <li className="px-3 py-4 text-[11px] text-slate-500">
                      No products available.
                    </li>
                  ) : (
                    (() => {
                      const categoryMap =
                        new Map();

                      allProducts.forEach(
                        (p) => {
                          const categoryId =
                            getCategoryId(p);

                          if (!categoryId)
                            return;

                          const categoryObject =
                            typeof p.category ===
                            "object"
                              ? p.category
                              : null;

                          if (
                            !categoryMap.has(
                              String(
                                categoryId
                              )
                            )
                          ) {
                            categoryMap.set(
                              String(
                                categoryId
                              ),
                              {
                                id: categoryId,
                                name:
                                  categoryObject?.name ||
                                  "Other Products",
                              }
                            );
                          }
                        }
                      );

                      const uniqueCategories =
                        Array.from(
                          categoryMap.values()
                        );

                      return uniqueCategories.map(
                        (category) => {
                          const categoryId =
                            String(
                              category.id
                            );

                          const categoryProducts =
                            productsByCategory[
                              categoryId
                            ] || [];

                          const isExpanded =
                            expandedCategory ===
                            categoryId;

                          const hasCurrentProduct =
                            categoryProducts.some(
                              (p) => {
                                const key =
                                  p.slug ||
                                  p._id;

                                return (
                                  key ===
                                    product.slug ||
                                  key ===
                                    product._id ||
                                  p._id ===
                                    currentId ||
                                  p.slug ===
                                    currentId
                                );
                              }
                            );

                          return (
                            <li
                              key={
                                categoryId
                              }
                              className="border-b border-slate-100 last:border-b-0"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleCategoryClick(
                                    categoryId
                                  )
                                }
                                className={`
                                  w-full
                                  flex
                                  items-center
                                  justify-between
                                  gap-2
                                  px-3
                                  py-2.5
                                  text-left
                                  transition-colors
                                  cursor-pointer
                                  ${
                                    isExpanded ||
                                    hasCurrentProduct
                                      ? "bg-sky-50 text-sky-900"
                                      : "bg-white text-slate-700"
                                  }
                                `}
                              >
                                <span
                                  className={`
                                    flex
                                    items-center
                                    gap-2
                                    min-w-0
                                    text-[12px]
                                    leading-snug
                                    ${
                                      isExpanded ||
                                      hasCurrentProduct
                                        ? "font-bold"
                                        : "font-semibold"
                                    }
                                  `}
                                >
                                  <span
                                    className={`
                                      shrink-0
                                      text-[11px]
                                      ${
                                        isExpanded ||
                                        hasCurrentProduct
                                          ? "text-sky-700"
                                          : "text-slate-400"
                                      }
                                    `}
                                  >
                                    »
                                  </span>

                                  <span className="truncate">
                                    {
                                      category.name
                                    }
                                  </span>
                                </span>

                                <span className="shrink-0">
                                  {isExpanded ? (
                                    <Minus
                                      size={
                                        14
                                      }
                                      className="text-sky-700"
                                    />
                                  ) : (
                                    <Plus
                                      size={
                                        14
                                      }
                                      className="text-slate-400"
                                    />
                                  )}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="bg-slate-50 border-t border-slate-200">

                                  <div className="max-h-[260px] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">

                                    {categoryProducts.length >
                                    0 ? (
                                      <ul className="list-none m-0 p-1.5">

                                        {categoryProducts.map(
                                          (p) => {
                                            const targetKey =
                                              p.slug ||
                                              p._id;

                                            const isActive =
                                              targetKey ===
                                                product.slug ||
                                              targetKey ===
                                                product._id ||
                                              p._id ===
                                                currentId ||
                                              p.slug ===
                                                currentId;

                                            return (
                                              <li
                                                key={
                                                  p._id ||
                                                  p.slug
                                                }
                                              >
                                                <Link
                                                  href={`/products/${targetKey}`}
                                                  onClick={() =>
                                                    setExpandedCategory(
                                                      categoryId
                                                    )
                                                  }
                                                  className={`
                                                    flex
                                                    items-start
                                                    gap-1.5
                                                    px-2.5
                                                    py-2
                                                    rounded
                                                    text-[11px]
                                                    leading-snug
                                                    transition-all
                                                    border-l-2
                                                    ${
                                                      isActive
                                                        ? "bg-white text-sky-800 font-bold border-sky-700 shadow-sm"
                                                        : "text-slate-600 border-transparent hover:bg-white hover:text-sky-700 hover:border-sky-400"
                                                    }
                                                  `}
                                                >
                                                  <span
                                                    className={`
                                                      shrink-0
                                                      ${
                                                        isActive
                                                          ? "text-sky-700"
                                                          : "text-slate-400"
                                                      }
                                                    `}
                                                  >
                                                    ›
                                                  </span>

                                                  <span className="flex-1">
                                                    {
                                                      p.name
                                                    }
                                                  </span>
                                                </Link>
                                              </li>
                                            );
                                          }
                                        )}

                                      </ul>
                                    ) : (
                                      <div className="px-3 py-3 text-[10.5px] text-slate-500 italic">
                                        No products found in
                                        this category.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        }
                      );
                    })()
                  )}

                </ul>
              </div>
            </div>
          </aside>

          {/* =================================================
              CENTER PRODUCT DETAILS
          ================================================= */}

          <main className="min-w-0 bg-white border border-slate-300 rounded p-4 sm:p-5 shadow-sm">

            {/* =================================================
                TITLE
            ================================================= */}

            <div className="border-b border-slate-200 pb-3 mb-4">

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">

                <div className="flex flex-col items-start min-w-0 flex-1">

                  {product.category?.name && (
                    <span className="inline-block bg-sky-100 text-sky-800 text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mb-1">
                      {
                        product.category
                          .name
                      }
                    </span>
                  )}

                  <h1 className="text-[20px] sm:text-[24px] font-bold text-slate-900 tracking-tight leading-snug">
                    {product.name}
                  </h1>

                  {product.shortDescription && (
                    <p className="mt-1 text-[12.5px] text-slate-600 leading-relaxed max-w-2xl">
                      {
                        product.shortDescription
                      }
                    </p>
                  )}
                </div>

                {/* PDF + SHARE */}

                <div className="shrink-0 self-start sm:self-auto flex items-center gap-2">

                  {product.pdf?.url && (
                    <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-md p-1.5 flex items-center gap-2 shadow-xs transition-all">

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

                      <div className="flex items-center gap-1">

                        <a
                          href={
                            product.pdf
                              .url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View PDF in new tab"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-semibold rounded shadow-2xs transition-colors whitespace-nowrap"
                        >
                          <ExternalLink
                            size={11}
                          />
                          <span>
                            View
                          </span>
                        </a>

                        {(() => {
                          const rawName =
                            (
                              product
                                .pdf
                                .name ||
                              product.slug ||
                              product.name ||
                              "machinery-specification"
                            )
                              .replace(
                                /\.pdf$/i,
                                ""
                              )
                              .trim()
                              .replace(
                                /\s+/g,
                                "-"
                              );

                          const downloadFileName =
                            `${rawName}-afptechnologies.pdf`;

                          return (
                            <a
                              href={`${product.pdf.url}${
                                product.pdf.url.includes(
                                  "?"
                                )
                                  ? "&"
                                  : "?"
                              }ik-attachment=true&response-content-disposition=attachment;filename=${encodeURIComponent(
                                downloadFileName
                              )}`}
                              download={
                                downloadFileName
                              }
                              title={`Download ${downloadFileName}`}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-sky-700 hover:bg-sky-800 text-white text-[10px] font-bold rounded shadow-2xs transition-colors whitespace-nowrap"
                            >
                              <Download
                                size={
                                  11
                                }
                              />
                              <span>
                                Download
                              </span>
                            </a>
                          );
                        })()}

                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      const shareUrl =
                        typeof window !==
                        "undefined"
                          ? window.location
                              .href
                          : "";

                      const shareTitle =
                        `${product.name} | AFP Technologies`;

                      const shareText =
                        `Explore specifications for ${product.name} at AFP Technologies.`;

                      if (
                        navigator.share
                      ) {
                        try {
                          await navigator.share(
                            {
                              title:
                                shareTitle,
                              text: shareText,
                              url: shareUrl,
                            }
                          );
                        } catch (err) {
                          if (
                            err.name !==
                              "AbortError" &&
                            navigator.clipboard
                          ) {
                            navigator.clipboard.writeText(
                              shareUrl
                            );

                            alert(
                              "Product link copied to clipboard!"
                            );
                          }
                        }
                      } else if (
                        navigator.clipboard
                      ) {
                        navigator.clipboard.writeText(
                          shareUrl
                        );

                        alert(
                          "Product link copied to clipboard!"
                        );
                      }
                    }}
                    title="Share this product"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 text-[11px] font-semibold rounded-md shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <Share2
                      size={13}
                      className="text-sky-600 shrink-0"
                    />

                    <span>
                      Share
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* =====================================================
                IMAGE GALLERY
                IMPORTANT:
                Hover is attached to ACTUAL IMAGE only.
            ===================================================== */}

            <div className="border border-slate-200 rounded p-1.5 bg-slate-50 mb-4">

              <div className="relative w-full aspect-[16/9] max-h-[320px] bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">

                <img
                  src={activeImage.url}
                  alt={activeImage.alt}
                  draggable="false"
                  onMouseEnter={(e) =>
                    openImagePreview(
                      activeImage,
                      e.currentTarget
                    )
                  }
                  className="max-w-full max-h-full w-auto h-auto object-contain block select-none cursor-zoom-in"
                />

                {galleryImages.length >
                  1 && (
                  <>
                    <button
                      type="button"
                      onClick={
                        handlePrevImage
                      }
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-sky-700 hover:text-white text-slate-700 p-1 rounded shadow-sm border border-slate-300 z-10"
                    >
                      <ChevronLeft
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleNextImage
                      }
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-sky-700 hover:text-white text-slate-700 p-1 rounded shadow-sm border border-slate-300 z-10"
                    >
                      <ChevronRight
                        size={16}
                      />
                    </button>
                  </>
                )}
              </div>

              {galleryImages.length >
                1 && (
                <div className="flex gap-1.5 mt-2 overflow-x-auto pb-0.5">

                  {galleryImages.map(
                    (img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setSelectedIndex(
                            idx
                          )
                        }
                        className={`relative w-14 h-9 rounded border flex-shrink-0 overflow-hidden bg-slate-100 ${
                          selectedIndex ===
                          idx
                            ? "border-sky-700 ring-1 ring-sky-600 opacity-100"
                            : "border-slate-300 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt}
                          draggable="false"
                          className="w-full h-full object-cover select-none"
                        />
                      </button>
                    )
                  )}

                </div>
              )}
            </div>

            {/* =====================================================
                QUICK SPECS
            ===================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">

              <div className="bg-slate-50 border border-slate-200 border-t-2 border-t-sky-700 rounded p-2">
                <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                  Automation
                </span>

                <strong className="text-[11px] font-bold text-slate-900">
                  {product.automationType ||
                    "Fully Automatic"}
                </strong>
              </div>

              <div className="bg-slate-50 border border-slate-200 border-t-2 border-t-sky-700 rounded p-2">
                <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                  Material Grade
                </span>

                <strong className="text-[11px] font-bold text-slate-900">
                  {product.material ||
                    "AISI 304 Stainless"}
                </strong>
              </div>

              <div className="bg-slate-50 border border-slate-200 border-t-2 border-t-sky-700 rounded p-2">
                <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                  Warranty Support
                </span>

                <strong className="text-[11px] font-bold text-slate-900">
                  {product.warranty ||
                    "OEM Warranty"}
                </strong>
              </div>

            </div>

            {/* =====================================================
                DESCRIPTION
            ===================================================== */}

            {product.description && (
              <section className="mb-4">

                <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                  Product Description
                </h3>

                <div className="text-[11.5px] text-slate-700 leading-relaxed space-y-1.5">
                  <p>
                    {product.description}
                  </p>

                  {product.detailedDescription && (
                    <p>
                      {
                        product.detailedDescription
                      }
                    </p>
                  )}
                </div>

              </section>
            )}

            {/* =====================================================
                BIG IMAGE
                FIXED:
                - object-contain
                - image itself is hover source
                - container is NOT hover source
            ===================================================== */}

            {product?.BigSizeImage?.url && (
              <section className="mb-6">

                <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider pb-1 mb-3">
                  Featured Equipment View
                </h3>

                <div className="relative w-full min-h-[180px] max-h-[600px] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">

                  <img
                    src={
                      product
                        .BigSizeImage
                        .url
                    }
                    alt={
                      product
                        .BigSizeImage
                        .alt ||
                      product.name ||
                      "Industrial machine full view"
                    }
                    draggable="false"
                    onMouseEnter={(e) =>
                      openImagePreview(
                        {
                          url: product
                            .BigSizeImage
                            .url,
                          alt:
                            product
                              .BigSizeImage
                              .alt ||
                            product.name ||
                            "Industrial machine full view",
                        },
                        e.currentTarget
                      )
                    }
                    className="
                      block
                      max-w-full
                      max-h-[600px]
                      w-auto
                      h-auto
                      object-contain
                      select-none
                      cursor-zoom-in
                    "
                  />

                </div>

              </section>
            )}

            {/* =====================================================
                CAPACITIES
            ===================================================== */}

            {capacityList.length >
              0 && (
              <section className="mb-4">

                <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                  Standard Capacities
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">

                  {capacityList.map(
                    (cap, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] font-medium text-slate-800 flex items-center gap-1.5"
                      >
                        <span className="text-sky-700 font-bold">
                          •
                        </span>

                        <span>
                          {cap}
                        </span>
                      </div>
                    )
                  )}

                </div>
              </section>
            )}

            {/* =====================================================
                APPLICATIONS
            ===================================================== */}

            {((Array.isArray(
              product.applications
            ) &&
              product.applications.length >
                0) ||
              product.application) && (
              <section className="mb-4">

                <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                  Applications
                </h3>

                {Array.isArray(
                  product.applications
                ) &&
                product.applications.length >
                  0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">

                    {product.applications.map(
                      (app, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200 rounded p-2"
                        >
                          <strong className="text-[11px] font-bold text-sky-900 block">
                            »{" "}
                            {typeof app ===
                            "string"
                              ? app
                              : app.title}
                          </strong>

                          {app.description && (
                            <p className="text-[10.5px] text-slate-600 leading-normal mt-0.5">
                              {
                                app.description
                              }
                            </p>
                          )}
                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    {
                      product.application
                    }
                  </p>
                )}

              </section>
            )}

            {/* =====================================================
                ADVANTAGES + FEATURES
            ===================================================== */}

            {((Array.isArray(
              product.advantages
            ) &&
              product.advantages.length >
                0) ||
              (Array.isArray(
                product.features
              ) &&
                product.features.length >
                  0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4">

                {Array.isArray(
                  product.advantages
                ) &&
                  product.advantages.length >
                    0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded p-2.5">

                      <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                        Advantages
                      </h3>

                      <ul className="space-y-1 list-none p-0 m-0">

                        {product.advantages.map(
                          (adv, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight"
                            >
                              <span className="text-sky-700 font-extrabold">
                                »
                              </span>

                              <span>
                                {adv}
                              </span>
                            </li>
                          )
                        )}

                      </ul>
                    </div>
                  )}

                {Array.isArray(
                  product.features
                ) &&
                  product.features.length >
                    0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded p-2.5">

                      <h3 className="text-[21.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                        Key Features
                      </h3>

                      <ul className="space-y-1.5 list-none p-0 m-0">

                        {product.features.map(
                          (feat, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight"
                            >
                              <span className="text-emerald-700 font-extrabold">
                                »
                              </span>

                              <div>
                                <strong className="text-slate-900">
                                  {typeof feat ===
                                  "string"
                                    ? feat
                                    : feat.title}
                                </strong>

                                {feat.description && (
                                  <p className="text-[10px] text-slate-500 mt-0.5">
                                    {
                                      feat.description
                                    }
                                  </p>
                                )}
                              </div>
                            </li>
                          )
                        )}

                      </ul>
                    </div>
                  )}

              </div>
            )}

            {/* =====================================================
                TECHNICAL SPECIFICATIONS
            ===================================================== */}

            {((Array.isArray(
              product.specifications
            ) &&
              product.specifications.length >
                0) ||
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
                            {
                              product.power
                            }
                          </td>
                        </tr>
                      )}

                      {product.dimensions && (
                        <tr className="even:bg-slate-50">
                          <th className="py-1.5 px-2.5 font-semibold text-slate-600 w-1/3 border-r border-slate-200">
                            Dimensions
                          </th>

                          <td className="py-1.5 px-2.5 text-slate-900 font-medium">
                            {
                              product.dimensions
                            }
                          </td>
                        </tr>
                      )}

                      {product.material && (
                        <tr className="even:bg-slate-50">
                          <th className="py-1.5 px-2.5 font-semibold text-slate-600 w-1/3 border-r border-slate-200">
                            Material
                          </th>

                          <td className="py-1.5 px-2.5 text-slate-900 font-medium">
                            {
                              product.material
                            }
                          </td>
                        </tr>
                      )}

                      {Array.isArray(
                        product.specifications
                      ) &&
                        product.specifications.map(
                          (
                            spec,
                            idx
                          ) => (
                            <tr
                              key={idx}
                              className="even:bg-slate-50"
                            >
                              <th className="py-1.5 px-2.5 font-semibold text-slate-600 w-1/3 border-r border-slate-200">
                                {spec.key ||
                                  spec.title}
                              </th>

                              <td className="py-1.5 px-2.5 text-slate-900 font-medium">
                                {
                                  spec.value
                                }
                              </td>
                            </tr>
                          )
                        )}

                    </tbody>

                  </table>
                </div>

              </section>
            )}

            {/* =====================================================
                BROCHURE
            ===================================================== */}

            {product.pdf?.url && (
              <div className="mb-4">

                <a
                  href={
                    product.pdf.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-[10.5px] font-bold rounded"
                >
                  <FileText
                    size={13}
                  />

                  <span>
                    Download Technical
                    Datasheet (
                    {product.pdf.name ||
                      "PDF Data"}
                    )
                  </span>
                </a>

              </div>
            )}

            {/* =====================================================
                INQUIRY
            ===================================================== */}

            <div className="bg-slate-50 border border-slate-300 rounded p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">

              <div>
                <h3 className="text-[11.5px] font-bold text-slate-900">
                  Need Engineering Layout &
                  Quotation?
                </h3>

                <p className="text-[10.5px] text-slate-500">
                  Contact our sales engineering team
                  for formal proposals.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hello, I would like to get technical specifications and a quotation for: ${product.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-600 hover:text-white border border-emerald-600 text-emerald-700 text-[10.5px] font-bold rounded shadow-sm"
                >
                  <MessageCircle
                    size={13}
                  />
                  WhatsApp
                </a>

                <Link
                  href={`/contact?product=${encodeURIComponent(
                    product.name
                  )}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white text-[10.5px] font-bold rounded shadow-sm"
                >
                  <Mail size={13} />
                  Request Quote
                </Link>

              </div>

            </div>

          </main>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          {processSteps.length >
            0 && (
            <aside className="sticky top-20">

              <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">

                <div className="bg-slate-800 border-b border-slate-900 px-3 py-2">
                  <h3 className="text-[13px] font-bold tracking-wider text-white uppercase">
                    Process Flow
                  </h3>
                </div>

                <ol className="divide-y divide-slate-100 list-none p-0 m-0">

                  {processSteps.map(
                    (step, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-1.5 px-2.5 py-1.5"
                      >
                        <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>

                        <span className="text-[10.5px] font-medium text-slate-700 leading-tight">
                          {typeof step ===
                          "string"
                            ? step
                            : step.title}
                        </span>
                      </li>
                    )
                  )}

                </ol>
              </div>

            </aside>
          )}

        </div>
      </div>

      {/* =========================================================
          LARGE CENTER IMAGE HOVER PREVIEW
          
          IMPORTANT:
          Preview itself remains centered.
          Actual image uses object-contain.
          Zoom happens only inside preview.
      ========================================================= */}

      {previewImage && (
        <div
          className="
            hidden lg:flex
            fixed inset-0
            z-[100]
            items-center justify-center
            bg-black/20
            backdrop-blur-[1px]
            pointer-events-none
          "
        >

          <div
            ref={previewRef}
            className="
              relative
              w-[55vw]
              max-w-[900px]
              h-[70vh]
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
              pointer-events-auto
            "
            onMouseMove={
              handlePreviewMouseMove
            }
          >

            <div className="relative w-full h-full overflow-hidden bg-slate-100 flex items-center justify-center">

              <img
                src={previewImage.url}
                alt={previewImage.alt}
                draggable="false"
                className="
                  max-w-full
                  max-h-full
                  w-auto
                  h-auto
                  object-contain
                  select-none
                  transition-transform
                  duration-150
                  ease-out
                "
                style={{
                  transform: "scale(1.7)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />

            </div>

          </div>
        </div>
      )}

    </div>
  );
}