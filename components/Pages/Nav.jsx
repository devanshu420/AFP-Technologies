"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Menu,
  X,
  Plus,
  Minus,
  FileText,
  Download,
  Search,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* =========================================================
   NAV CACHE
========================================================= */

let navCache = {
  categories: null,
  products: null,
  downloads: null,
  timestamp: null,
};

const CACHE_DURATION = 5 * 60 * 1000;

/* =========================================================
   NAV COMPONENT
========================================================= */

export default function Nav() {
  const [open, setOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [downloadsDropdownOpen, setDownloadsDropdownOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categoryLocked, setCategoryLocked] = useState(false);

  const [downloadsList, setDownloadsList] = useState([]);

  /* =========================================================
     SEARCH STATES
  ========================================================= */

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const pathname = usePathname();

  /* =========================================================
     LOAD NAVIGATION DATA
  ========================================================= */

  useEffect(() => {
    async function fetchNavData() {
      const now = Date.now();

      if (
        navCache.categories &&
        navCache.products &&
        navCache.downloads &&
        navCache.timestamp &&
        now - navCache.timestamp < CACHE_DURATION
      ) {
        setCategories(navCache.categories);
        setProducts(navCache.products);
        setDownloadsList(navCache.downloads);

        if (navCache.categories.length > 0) {
          setHoveredCategory(navCache.categories[0]._id);
        }

        return;
      }

      try {
        const [catRes, prodRes, downRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/products?limit=100`),
          fetch(`${API_BASE_URL}/downloads/public?limit=20`),
        ]);

        const catJson = await catRes.json();
        const prodJson = await prodRes.json();
        const downJson = await downRes.json();

        const catList = Array.isArray(catJson?.data) ? catJson.data : [];

        const prodList = Array.isArray(prodJson?.data?.products)
          ? prodJson.data.products
          : Array.isArray(prodJson?.data)
            ? prodJson.data
            : [];

        const pdfList = Array.isArray(downJson?.data)
          ? downJson.data
          : Array.isArray(downJson?.data?.data)
            ? downJson.data.data
            : [];

        navCache = {
          categories: catList,
          products: prodList,
          downloads: pdfList,
          timestamp: Date.now(),
        };

        setCategories(catList);
        setProducts(prodList);
        setDownloadsList(pdfList);

        if (catList.length > 0) {
          setHoveredCategory(catList[0]._id);
        }
      } catch (err) {
        console.error("Failed to load navigation dropdown data:", err);
      }
    }

    fetchNavData();
  }, []);

  /* =========================================================
     CATEGORY FILTER
  ========================================================= */

  const filteredProducts = products.filter((product) => {
    if (!hoveredCategory) return false;

    const productCategoryId = product.category?._id || product.category;

    return String(productCategoryId) === String(hoveredCategory);
  });

  /* =========================================================
     LIVE PRODUCT SEARCH
  ========================================================= */

  useEffect(() => {
    const query = searchQuery.trim();

    // Empty search
    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchLoading(false);
      return;
    }

    // Debounce API call
    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        setShowSearchResults(true);

        const response = await fetch(
          `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
        );

        if (!response.ok) {
          throw new Error(`Search API failed: ${response.status}`);
        }

        const json = await response.json();

        if (json?.success && Array.isArray(json?.data)) {
          setSearchResults(json.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Product search failed:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* =========================================================
     SEARCH SUBMIT
  ========================================================= */

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    /*
      If matching product exists,
      open the first matching product.
    */
    if (searchResults.length > 0) {
      const firstProduct = searchResults[0];

      window.location.href = `/products/${
        firstProduct.slug || firstProduct._id
      }`;

      return;
    }

    /*
      If no direct product result,
      keep existing equipment search behaviour.
    */
    window.location.href = `/equipment?search=${encodeURIComponent(query)}`;
  };

  /* =========================================================
     CLOSE SEARCH
  ========================================================= */

  const closeSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  /* =========================================================
     NAV LINKS
  ========================================================= */

  const navLinks = [
    {
      name: "Equipment Range",
      href: "/equipment-range",
    },
    {
      name: "About us",
      href: "/about",
    },
  ];

  /* =========================================================
     CLOSE PRODUCTS MENU
  ========================================================= */

  const closeProductsMenu = () => {
    setDropdownOpen(false);
    setHoveredCategory(null);
    setCategoryLocked(false);
  };

  /* =========================================================
     SEARCH COMPONENT
  ========================================================= */

  const renderSearchBox = (mobile = false) => {
    return (
      <div className={`relative ${mobile ? "w-full" : "w-full"}`}>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
            <Search size={14} />
          </span>

          <input
            type="text"
            value={searchQuery} 
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onFocus={() => {
              if (searchQuery.trim()) {
                setShowSearchResults(true);
              }
            }}
            placeholder={
              mobile ? "Search machinery..." : "Search machinery & parts..."
            }
            className={`w-full ${
              mobile ? "py-2.5" : "py-1.5"
            } pl-9 pr-9 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-all shadow-inner`}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={closeSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </form>

        {showSearchResults && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-200 border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-[100]">
            {searchLoading ? (
              <div className="px-4 py-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin" />
                  Searching products...
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-sky-400">
                    Products
                  </p>
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug || product._id}`}
                      onClick={() => {
                        closeSearch();
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 bg-slate-200 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-200 border border-slate-200 shrink-0">
                        {product.mainImage?.url ? (
                          <img
                            src={product.mainImage.url}
                            alt={product.mainImage.alt || product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search size={14} className="text-slate-600" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-slate-900 font-medium truncate group-hover:text-sky-400">
                          {product.name}
                        </p>

                        {product.category?.name && (
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                            {product.category.name}
                          </p>
                        )}
                      </div>

                      <ArrowRight
                        size={13}
                        className="text-slate-600 group-hover:text-sky-400 shrink-0"
                      />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="px-4 py-5 text-center">
                <Search size={14} className="text-slate-500 mx-auto mb-2" />

                <p className="text-xs text-slate-400">No products found</p>

                <p className="text-[10px] text-slate-600 mt-1 truncate">
                  No match for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <header className="navbar-v2 sticky top-0 z-50 bg-[#071b32] border-b border-white/10 backdrop-blur-md">
      {/* =====================================================
          NAVBAR CONTAINER
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4 relative">
        {/* ===================================================
            1. LEFT - BRAND LOGO
        =================================================== */}

        <Link
          className="inline-flex items-center gap-2 text-white font-bold text-sm sm:text-base tracking-tight no-underline shrink-0"
          href="/"
          aria-label="AFP Technologies home"
        >
          <span className="w-10 h-10 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/afp-logo.png"
              alt="AFP Technologies Logo"
              className="w-full h-full object-contain"
            />
          </span>

          <span className="truncate">
            AFP Technologies
          </span>
        </Link>

        {/* ===================================================
            2. DESKTOP SEARCH
        =================================================== */}

        <div className="hidden md:flex flex-1 max-w-sm mx-auto">
          {renderSearchBox(false)}
        </div>

        {/* ===================================================
            3. RIGHT NAVIGATION
        =================================================== */}

        <nav
          className={`${
            open ? "flex" : "hidden"
          } md:flex items-center gap-4 lg:gap-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#071b32] md:bg-transparent flex-col md:flex-row items-start md:items-center p-4 md:p-0 border-b md:border-0 border-white/10 shadow-2xl md:shadow-none z-50`}
          aria-label="Primary navigation"
        >
          {/* =================================================
              MOBILE SEARCH
          ================================================= */}

          <div className="w-full md:hidden mb-2">{renderSearchBox(true)}</div>

          {/* =================================================
              PRODUCTS DROPDOWN
          ================================================= */}

          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => {
              if (!categoryLocked) {
                closeProductsMenu();
              }
            }}
          >
            <Link
              href="/products"
              onClick={(e) => {
                setOpen(false);

                if (pathname === "/products") {
                  e.preventDefault();
                }

                setDropdownOpen(true);
              }}
              className={`relative pb-1 text-xs sm:text-sm font-medium inline-flex items-center gap-1 transition-colors ${
                pathname === "/products"
                  ? "text-sky-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Products {dropdownOpen ? <Minus size={12} /> : <Plus size={12} />}
              {pathname === "/products" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />
              )}
            </Link>

            {/* Products Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full -left-20 w-[280px] bg-[#030a16] border border-white/10 rounded-xl shadow-2xl p-3 z-50 mt-1">
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2">
                  Categories
                </p>

                <ul className="max-h-[300px] overflow-y-auto space-y-1 pr-1">
                  {categories.map((cat) => {
                    const isSelected =
                      String(hoveredCategory) === String(cat._id);

                    return (
                      <li
                        key={cat._id}
                        onMouseEnter={() => setHoveredCategory(cat._id)}
                        onClick={(e) => {
                          e.stopPropagation();

                          setHoveredCategory(cat._id);
                          setCategoryLocked(true);
                          setDropdownOpen(true);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "bg-sky-500/15 text-sky-400 font-bold"
                            : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>

                        {isSelected ? (
                          <Minus size={11} className="text-sky-400 shrink-0" />
                        ) : (
                          <Plus size={11} className="text-slate-500 shrink-0" />
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Machinery Sub Panel */}
                {hoveredCategory && (
                  <div
                    className="absolute top-0 left-full ml-1.5 w-[300px] bg-[#030a16] border border-white/10 rounded-xl shadow-2xl p-3 z-50"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => {
                      if (!categoryLocked) {
                        setHoveredCategory(null);
                      }
                    }}
                  >
                    <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2">
                      Systems & Machinery
                    </p>

                    <div className="max-h-[280px] overflow-y-auto space-y-1">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                          <Link
                            key={p._id}
                            href={`/products/${p.slug || p._id}`}
                            onClick={() => {
                              closeProductsMenu();
                              setOpen(false);
                            }}
                            className="block px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:text-sky-400 hover:bg-white/5 transition-colors truncate"
                          >
                            • {p.name}
                          </Link>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500 italic px-2 py-1 block">
                          No equipment found.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =================================================
              STANDARD NAV LINKS
          ================================================= */}

          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setOpen(false);

                  if (isActive) {
                    e.preventDefault();
                  }
                }}
                className={`relative pb-1 text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? "text-sky-400 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.name}

                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />
                )}
              </Link>
            );
          })}

          {/* =================================================
              DOWNLOADS DROPDOWN
          ================================================= */}

          <div
            className="relative"
            onMouseEnter={() => setDownloadsDropdownOpen(true)}
            onMouseLeave={() => setDownloadsDropdownOpen(false)}
          >
            <Link
              href="/downloads-pdf"
              onClick={(e) => {
                setOpen(false);

                if (pathname === "/downloads-pdf") {
                  e.preventDefault();
                }
              }}
              className={`relative pb-1 text-xs sm:text-sm font-medium inline-flex items-center gap-1 transition-colors ${
                pathname === "/downloads-pdf"
                  ? "text-sky-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Downloads{" "}
              {downloadsDropdownOpen ? <Minus size={12} /> : <Plus size={12} />}
              {pathname === "/downloads-pdf" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />
              )}
            </Link>

            {/* Downloads Dropdown */}
            {downloadsDropdownOpen && (
              <div className="absolute top-full -left-20 w-[300px] bg-[#030a16] border border-white/10 rounded-xl shadow-2xl p-3 z-50 mt-1">
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2">
                  Datasheets & PDFs
                </p>

                <div className="max-h-[240px] overflow-y-auto space-y-1">
                  {downloadsList.length > 0 ? (
                    downloadsList.map((pdf) => (
                      <a
                        key={pdf._id || pdf.id}
                        href={pdf.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setDownloadsDropdownOpen(false)}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:text-sky-400 hover:bg-white/5 transition-colors"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <FileText
                            size={12}
                            className="text-rose-500 shrink-0"
                          />

                          <span className="truncate">{pdf.title}</span>
                        </span>

                        <Download
                          size={11}
                          className="text-slate-400 shrink-0 ml-2"
                        />
                      </a>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500 italic px-2 py-1 block">
                      No documents available.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              GET A QUOTE
          ================================================= */}

          <Link
            href="/contact"
            onClick={(e) => {
              setOpen(false);

              if (pathname === "/contact") {
                e.preventDefault();
              }
            }}
            className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all shrink-0"
          >
            <span>Get a quote</span>
            <ArrowRight size={13} />
          </Link>
        </nav>

        {/* ===================================================
            MOBILE MENU BUTTON
        =================================================== */}

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
