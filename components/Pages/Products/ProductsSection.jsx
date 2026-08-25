'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Cpu } from 'lucide-react';
import ProductCard from './ProductCard';

const categories = [
  'All equipment',
  'Injection moulding',
  'CNC machining',
  'Packaging',
  'Material handling',
];

const CACHE_KEY = 'products_catalogue_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export default function ProductsSection({ isStandalone = false }) {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState(categories);
  const [selected, setSelected] = useState('All equipment');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    async function loadCatalogueData() {
      setLoading(true);

      try {
        // ============================================
        // 1. CHECK CACHE
        // ============================================
        const cachedData = sessionStorage.getItem(CACHE_KEY);

        if (cachedData) {
          try {
            const parsedCache = JSON.parse(cachedData);

            const cacheAge = Date.now() - parsedCache.timestamp;

            // Cache still valid
            if (cacheAge < CACHE_DURATION) {
              setProducts(parsedCache.products || []);

              setCategoriesList(
                parsedCache.categories?.length
                  ? parsedCache.categories
                  : categories
              );

              setLoading(false);

              console.log('Catalogue loaded from cache');

              return;
            }

            // Cache expired
            sessionStorage.removeItem(CACHE_KEY);
          } catch (cacheError) {
            console.error('Invalid catalogue cache:', cacheError);

            sessionStorage.removeItem(CACHE_KEY);
          }
        }

        // ============================================
        // 2. FETCH FROM API
        // ============================================
        console.log('Fetching catalogue from API...');

        const [prodRes, catRes] = await Promise.all([
          fetch(`${apiUrl}/products?limit=100`),
          fetch(`${apiUrl}/categories`),
        ]);

        if (!prodRes.ok) {
          throw new Error(
            `Products API failed: ${prodRes.status}`
          );
        }

        if (!catRes.ok) {
          throw new Error(
            `Categories API failed: ${catRes.status}`
          );
        }

        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        // ============================================
        // 3. PROCESS PRODUCTS
        // ============================================
        const fetchedProducts =
          prodJson?.data?.products ||
          prodJson?.data ||
          [];

        const validProducts = Array.isArray(fetchedProducts)
          ? fetchedProducts
          : [];

        setProducts(validProducts);

        // ============================================
        // 4. PROCESS CATEGORIES
        // ============================================
        let finalCategories = categories;

        if (
          catJson?.data &&
          Array.isArray(catJson.data) &&
          catJson.data.length > 0
        ) {
          const catNames = catJson.data
            .map((category) => category.name)
            .filter(Boolean);

          if (catNames.length > 0) {
            finalCategories = [
              'All equipment',
              ...catNames,
            ];
          }
        } else {
          // Fallback: get categories from products
          const uniqueCats = Array.from(
            new Set(
              validProducts
                .map(
                  (product) =>
                    product.category?.name || product.type
                )
                .filter(Boolean)
            )
          );

          if (uniqueCats.length > 0) {
            finalCategories = [
              'All equipment',
              ...uniqueCats,
            ];
          }
        }

        setCategoriesList(finalCategories);

        // ============================================
        // 5. SAVE DATA TO CACHE
        // ============================================
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            products: validProducts,
            categories: finalCategories,
          })
        );

        console.log('Catalogue saved to cache');
      } catch (err) {
        console.error(
          'Failed to load catalogue from DB:',
          err
        );
      } finally {
        setLoading(false);
      }
    }

    loadCatalogueData();
  }, []);

  // ============================================
  // FILTER PRODUCTS
  // ============================================
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      // Don't show inactive products
      if (product.active === false) {
        return false;
      }

      const typeStr =
        product.category?.name ||
        product.type ||
        '';

      const matchesCategory =
        selected === 'All equipment' ||
        typeStr.toLowerCase() ===
          selected.toLowerCase();

      const matchesQuery =
        (product.name || '')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [products, selected, query]);

  return (
    <section
      id="products"
      className="py-16 bg-slate-50/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ==========================================
            SECTION HEADER
        ========================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">

          <div>
            <p className="text-sky-600 font-bold text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />

              LIVE CATALOGUE
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Machines that <br />

              <span className="text-sky-600 italic">
                move industries.
              </span>
            </h2>
          </div>

          {!isStandalone && (
            <Link
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all shadow-sm self-start md:self-auto"
              href="/equipment"
            >
              View all equipment

              <ArrowRight size={17} />
            </Link>
          )}
        </div>

        {/* ==========================================
            FILTER BAR
        ========================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">

          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">

            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelected(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  selected === cat
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="relative min-w-[260px]">

            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search machinery..."
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* ==========================================
            LOADING
        ========================================== */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4 shadow-sm"
                >
                  <div className="h-48 bg-slate-200 rounded-xl w-full" />

                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />

                    <div className="h-6 bg-slate-200 rounded w-3/4" />

                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>

                  <div className="pt-2 flex justify-between items-center">

                    <div className="h-4 bg-slate-200 rounded w-1/4" />

                    <div className="h-8 bg-slate-200 rounded-lg w-1/4" />

                  </div>
                </div>
              )
            )}
          </div>

        ) : filtered.length > 0 ? (

          /* ==========================================
             PRODUCTS
          ========================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}

          </div>

        ) : (

          /* ==========================================
             EMPTY STATE
          ========================================== */
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs">

            <Cpu
              size={48}
              className="mx-auto text-slate-300 mb-3"
            />

            <h3 className="text-lg font-bold text-slate-700">
              No machinery found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search query or
              category filter.
            </p>

          </div>
        )}
      </div>
    </section>
  );
}