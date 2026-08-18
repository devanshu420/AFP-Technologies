'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductsSection({ isStandalone = false }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All equipment']);
  const [selected, setSelected] = useState('All equipment');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${apiUrl}/products?limit=100`, { cache: 'no-store' }),
          fetch(`${apiUrl}/categories`, { cache: 'no-store' }),
        ]);

        const [prodJson, catJson] = await Promise.all([
          prodRes.json(),
          catRes.json(),
        ]);

        const fetchedProducts = prodJson?.data?.products || prodJson?.data || [];
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);

        if (catJson?.data && Array.isArray(catJson.data) && catJson.data.length > 0) {
          const catNames = catJson.data.map((c) => c.name);
          setCategories(['All equipment', ...catNames]);
        } else {
          const uniqueCats = Array.from(
            new Set(
              fetchedProducts
                .map((p) => p.category?.name || p.type)
                .filter(Boolean)
            )
          );
          if (uniqueCats.length > 0) {
            setCategories(['All equipment', ...uniqueCats]);
          }
        }
      } catch (err) {
        console.error('Failed to load catalogue from DB:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.active === false) return false;
      const typeStr = p.category?.name || p.type || '';
      const matchesCategory =
        selected === 'All equipment' ||
        typeStr.toLowerCase() === selected.toLowerCase();
      const matchesQuery = (p.name || '')
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, selected, query]);

  return (
    <section id="products" className="products section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="kicker dark">
              <span /> LIVE CATALOGUE
            </p>
            <h2>
              Machines that
              <br />
              <em>move industries.</em>
            </h2>
          </div>
          {!isStandalone && (
            <Link className="button outline" href="/equipment">
              View all equipment <ArrowRight size={17} />
            </Link>
          )}
        </div>

        <div className="filter-bar">
          <div className="filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={selected === cat ? 'active' : ''}
                onClick={() => setSelected(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="search-field">
            <Search size={17} />
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search machines"
            />
          </label>
        </div>

        {/* Loading Skeleton Grid / Product Grid */}
        {loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6].map((skeletonId) => (
              <div
                key={skeletonId}
                className="animate-pulse bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                style={{ minHeight: '340px' }}
              >
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-slate-800/80 rounded-xl mb-4" />
                {/* Text Line 1 */}
                <div className="w-3/4 h-5 bg-slate-800/80 rounded mb-2" />
                {/* Text Line 2 */}
                <div className="w-1/2 h-4 bg-slate-800/60 rounded mb-4" />
                {/* Button Placeholder */}
                <div className="w-full h-10 bg-slate-800/80 rounded-lg mt-auto" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h3>No machinery found.</h3>
            <p className="admin-muted">Try adjusting your search query or selected category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product._id || product.slug || product.name}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}