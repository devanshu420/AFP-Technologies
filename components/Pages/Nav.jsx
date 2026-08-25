"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Plus,
  Minus,
  FileText,
  Download,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// 💡 Global In-Memory Cache to prevent duplicate repeated fetches
let navCache = {
  categories: null,
  products: null,
  downloads: null,
  timestamp: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 Minutes Cache TTL

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [downloadsDropdownOpen, setDownloadsDropdownOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [downloadsList, setDownloadsList] = useState([]);
  const pathname = usePathname();

  // Fetch categories, products, and downloads dynamically with local caching layer
  useEffect(() => {
    async function fetchNavData() {
      const now = Date.now();
      
      // Check if valid cache exists
      if (
        navCache.categories &&
        navCache.products &&
        navCache.downloads &&
        now - navCache.timestamp < CACHE_DURATION
      ) {
        setCategories(navCache.categories);
        setProducts(navCache.products);
        setDownloadsList(navCache.downloads);
        if (navCache.categories.length > 0) {
          setSelectedCategory(navCache.categories[0]._id);
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

        const catList = catJson?.data || [];
        const prodList = prodJson?.data?.products || prodJson?.data || [];
        const pdfList = Array.isArray(downJson?.data)
          ? downJson.data
          : downJson?.data?.data || [];

        // Save to global cache
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
          setSelectedCategory(catList[0]._id);
        }
      } catch (err) {
        console.error("Failed to load navigation dropdown data:", err);
      }
    }

    fetchNavData();
  }, []);

  // Filter products based on hovered category
  const filteredProducts = products.filter((p) => {
    const catId = p.category?._id || p.category;
    return catId === selectedCategory;
  });

  const navLinks = [
    { name: "Equipment", href: "/equipment" },
    { name: "About us", href: "/about" },
  ];

  return (
    <header
      className="site-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#071b32",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="container nav-wrap"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0.9rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Brand Logo */}
        <Link
          className="brand"
          href="/"
          aria-label="AFP Technologies home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "#f8fafc",
            fontWeight: 750,
            fontSize: "1.1rem",
          }}
        >
          <span
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="/afp-logo.png"
              alt="AFP Technologies Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </span>
          <span>
            AFP Technologies<span style={{ color: "#38bdf8" }}>.</span>
          </span>
        </Link>

        {/* Desktop & Mobile Navigation Links */}
        <nav
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Primary navigation"
          style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
        >
          {/* 1. Products Dropdown Menu on Hover */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              href="/products"
              onClick={(e) => {
                setOpen(false);
                if (pathname === "/products") e.preventDefault();
              }}
              style={{
                position: "relative",
                paddingBottom: "4px",
                color: pathname === "/products" ? "#38bdf8" : "#cbd5e1",
                fontWeight: pathname === "/products" ? 600 : 500,
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Products {dropdownOpen ? <Minus size={14} /> : <Plus size={14} />}
              {pathname === "/products" && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: "100%",
                    height: "2px",
                    backgroundColor: "#38bdf8",
                    borderRadius: "2px",
                  }}
                />
              )}
            </Link>

            {/* Products Mega Dropdown Box */}
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "-100px",
                  width: "680px",
                  backgroundColor: "#030a16",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  padding: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                    paddingRight: "1rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#38bdf8",
                      textTransform: "uppercase",
                      marginBottom: "0.75rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Categories
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat._id;
                      return (
                        <li
                          key={cat._id}
                          onMouseEnter={() => setSelectedCategory(cat._id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "6px",
                            backgroundColor: isSelected
                              ? "rgba(56, 189, 248, 0.15)"
                              : "transparent",
                            color: isSelected ? "#38bdf8" : "#cbd5e1",
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <span>{cat.name}</span>
                          {isSelected ? (
                            <Minus size={13} color="#38bdf8" />
                          ) : (
                            <Plus size={13} color="#94a3b8" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#38bdf8",
                      textTransform: "uppercase",
                      marginBottom: "0.75rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Systems & Machinery
                  </p>
                  <div
                    style={{
                      maxHeight: "240px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                    }}
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => {
                        const targetKey = p.slug || p._id;
                        return (
                          <Link
                            key={p._id}
                            href={`/products/${targetKey}`}
                            onClick={() => setDropdownOpen(false)}
                            style={{
                              padding: "0.5rem 0.75rem",
                              borderRadius: "6px",
                              color: "#cbd5e1",
                              textDecoration: "none",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                              transition:
                                "background 0.2s ease, color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(255,255,255,0.06)";
                              e.currentTarget.style.color = "#38bdf8";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color = "#cbd5e1";
                            }}
                          >
                            • {p.name}
                          </Link>
                        );
                      })
                    ) : (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#64748b",
                          fontStyle: "italic",
                          padding: "0.5rem",
                        }}
                      >
                        No equipment found in this category.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Standard Nav Links */}
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setOpen(false);
                  if (isActive) e.preventDefault();
                }}
                style={{
                  position: "relative",
                  paddingBottom: "4px",
                  color: isActive ? "#38bdf8" : "#cbd5e1",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                {link.name}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "#38bdf8",
                      borderRadius: "2px",
                    }}
                  />
                )}
              </Link>
            );
          })}

          {/* 2. Downloads Dropdown Menu on Hover */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setDownloadsDropdownOpen(true)}
            onMouseLeave={() => setDownloadsDropdownOpen(false)}
          >
            <Link
              href="/downloads-pdf"
              onClick={(e) => {
                setOpen(false);
                if (pathname === "/downloads-pdf") e.preventDefault();
              }}
              style={{
                position: "relative",
                paddingBottom: "4px",
                color: pathname === "/downloads-pdf" ? "#38bdf8" : "#cbd5e1",
                fontWeight: pathname === "/downloads-pdf" ? 600 : 500,
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Downloads{" "}
              {downloadsDropdownOpen ? <Minus size={14} /> : <Plus size={14} />}
              {pathname === "/downloads-pdf" && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: "100%",
                    height: "2px",
                    backgroundColor: "#38bdf8",
                    borderRadius: "2px",
                  }}
                />
              )}
            </Link>

            {/* Downloads Dropdown Box */}
            {downloadsDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "-120px",
                  width: "340px",
                  backgroundColor: "#030a16",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  padding: "1rem",
                  zIndex: 100,
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#38bdf8",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Available Datasheets & PDFs
                </p>
                <div
                  style={{
                    maxHeight: "260px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                  }}
                >
                  {downloadsList.length > 0 ? (
                    downloadsList.map((pdf) => {
                      const pdfId = pdf._id || pdf.id;
                      return (
                        <a
                          key={pdfId}
                          href={pdf.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDownloadsDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "6px",
                            color: "#cbd5e1",
                            textDecoration: "none",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            transition: "background 0.2s ease, color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(255,255,255,0.06)";
                            e.currentTarget.style.color = "#38bdf8";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#cbd5e1";
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <FileText size={13} color="#f43f5e" /> {pdf.title}
                          </span>
                          <Download size={12} color="#94a3b8" />
                        </a>
                      );
                    })
                  ) : (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748b",
                        fontStyle: "italic",
                        padding: "0.5rem",
                      }}
                    >
                      No documents available right now.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CTA Quote Button */}
          <Link
            href="/contact"
            onClick={(e) => {
              setOpen(false);
              if (pathname === "/contact") e.preventDefault();
            }}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Get a quote <ArrowRight size={15} />
            {pathname === "/contact" && (
              <span
                style={{
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#38bdf8",
                  borderRadius: "2px",
                }}
              />
            )}
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
            color: "#f8fafc",
            cursor: "pointer",
            display: "none",
            padding: "4px",
          }}
          className="menu-toggle-btn md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .menu-toggle-btn {
            display: flex !important;
          }
          .main-nav {
            display: none !important;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: #071b32;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1.5rem 2rem;
            gap: 1.2rem !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .main-nav.is-open {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}