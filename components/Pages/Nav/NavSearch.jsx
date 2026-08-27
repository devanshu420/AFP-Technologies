"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  X,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function NavSearch({
  mobile = false,
  onCloseMenu,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] =
    useState(false);

  /* =========================================================
     LIVE PRODUCT SEARCH
  ========================================================= */

  useEffect(() => {
    const query = searchQuery.trim();

    /* =====================================================
       EMPTY SEARCH
    ===================================================== */

    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchLoading(false);

      return;
    }

    /* =====================================================
       DEBOUNCED API CALL
    ===================================================== */

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        setShowSearchResults(true);

        const response = await fetch(
          `${API_BASE_URL}/products/search?q=${encodeURIComponent(
            query
          )}`
        );

        if (!response.ok) {
          throw new Error(
            `Search API failed: ${response.status}`
          );
        }

        const json = await response.json();

        if (
          json?.success &&
          Array.isArray(json?.data)
        ) {
          setSearchResults(json.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error(
          "Product search failed:",
          error
        );

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

    /* =====================================================
       OPEN FIRST MATCHING PRODUCT
    ===================================================== */

    if (searchResults.length > 0) {
      const firstProduct = searchResults[0];

      window.location.href = `/products/${
        firstProduct.slug || firstProduct._id
      }`;

      return;
    }

    /* =====================================================
       FALLBACK EQUIPMENT SEARCH
    ===================================================== */

    window.location.href = `/equipment?search=${encodeURIComponent(
      query
    )}`;
  };

  /* =========================================================
     CLOSE SEARCH
  ========================================================= */

  const closeSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchLoading(false);
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="relative w-full">
      {/* =====================================================
          SEARCH FORM
      ===================================================== */}

      <form
        onSubmit={handleSearchSubmit}
        className="relative w-full"
      >
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
            mobile
              ? "Search machinery..."
              : "Search machinery & parts..."
          }
          className={`w-full ${
            mobile ? "py-2.5" : "py-1.5"
          } pl-9 pr-9 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-all shadow-inner`}
        />

        {/* CLEAR BUTTON */}

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

      {/* =====================================================
          SEARCH RESULTS
      ===================================================== */}

      {showSearchResults &&
        searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-200 border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-[100]">

            {/* LOADING */}

            {searchLoading ? (
              <div className="px-4 py-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin" />

                  Searching products...
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                {/* RESULTS TITLE */}

                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-sky-400">
                    Products
                  </p>
                </div>

                {/* RESULTS LIST */}

                <div className="max-h-[320px] overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${
                        product.slug || product._id
                      }`}
                      onClick={() => {
                        closeSearch();
                        onCloseMenu?.();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 bg-slate-200 hover:bg-slate-50 transition-colors group"
                    >
                      {/* PRODUCT IMAGE */}

                      <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-200 border border-slate-200 shrink-0">
                        {product.mainImage?.url ? (
                          <img
                            src={product.mainImage.url}
                            alt={
                              product.mainImage.alt ||
                              product.name
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search
                              size={14}
                              className="text-slate-600"
                            />
                          </div>
                        )}
                      </div>

                      {/* PRODUCT DETAILS */}

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

                      {/* ARROW */}

                      <ArrowRight
                        size={13}
                        className="text-slate-600 group-hover:text-sky-400 shrink-0"
                      />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              /* NO RESULTS */

              <div className="px-4 py-5 text-center">
                <Search
                  size={14}
                  className="text-slate-500 mx-auto mb-2"
                />

                <p className="text-xs text-slate-400">
                  No products found
                </p>

                <p className="text-[10px] text-slate-600 mt-1 truncate">
                  No match for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}