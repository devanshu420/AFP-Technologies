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
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Global in-memory cache
let navCache = {
  categories: null,
  products: null,
  downloads: null,
  timestamp: null,
};

const CACHE_DURATION = 5 * 60 * 1000;

export default function Nav() {
  const [open, setOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [downloadsDropdownOpen, setDownloadsDropdownOpen] =
    useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Category currently selected/hovered
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // IMPORTANT:
  // When user clicks a category, panel remains open
  const [categoryLocked, setCategoryLocked] = useState(false);

  const [downloadsList, setDownloadsList] = useState([]);

  const pathname = usePathname();

  // =========================================================
  // FETCH NAV DATA
  // =========================================================
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

        const catList = Array.isArray(catJson?.data)
          ? catJson.data
          : [];

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
      } catch (err) {
        console.error(
          "Failed to load navigation dropdown data:",
          err
        );
      }
    }

    fetchNavData();
  }, []);

  // =========================================================
  // PRODUCTS OF SELECTED CATEGORY
  // =========================================================
  const filteredProducts = products.filter((product) => {
    if (!hoveredCategory) return false;

    const productCategoryId =
      product.category?._id || product.category;

    return (
      String(productCategoryId) ===
      String(hoveredCategory)
    );
  });

  const navLinks = [
    { name: "Equipment", href: "/equipment" },
    { name: "About us", href: "/about" },
  ];

  // =========================================================
  // CLOSE PRODUCTS MENU
  // =========================================================
  const closeProductsMenu = () => {
    setDropdownOpen(false);
    setHoveredCategory(null);
    setCategoryLocked(false);
  };

  return (
    <header
      className="site-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#071b32",
        borderBottom:
          "1px solid rgba(255, 255, 255, 0.08)",
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
        {/* =====================================================
            BRAND
        ===================================================== */}
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
            AFP Technologies
            <span style={{ color: "#38bdf8" }}>
              .
            </span>
          </span>
        </Link>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <nav
          className={
            open ? "main-nav is-open" : "main-nav"
          }
          aria-label="Primary navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* ===================================================
              PRODUCTS
          =================================================== */}
          <div
            className="products-nav-wrapper"
            style={{
              position: "relative",
            }}
            /*
              IMPORTANT:
              Do NOT reset hoveredCategory on mouse leave.

              This allows the cursor to move from:
              Category -> Machinery panel
              without closing the panel.
            */
            onMouseEnter={() => {
              setDropdownOpen(true);
            }}
            onMouseLeave={() => {
              // Only close if category wasn't clicked/locked
              if (!categoryLocked) {
                closeProductsMenu();
              }
            }}
          >
            {/* Products Link */}
            <Link
              href="/products"
              onClick={(e) => {
                setOpen(false);

                /*
                  If already on /products:
                  prevent unnecessary navigation.
                */
                if (pathname === "/products") {
                  e.preventDefault();
                }

                /*
                  Clicking Products should open
                  category panel.
                */
                setDropdownOpen(true);
              }}
              style={{
                position: "relative",
                paddingBottom: "4px",
                color:
                  pathname === "/products"
                    ? "#38bdf8"
                    : "#cbd5e1",
                fontWeight:
                  pathname === "/products"
                    ? 600
                    : 500,
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Products{" "}
              {dropdownOpen ? (
                <Minus size={14} />
              ) : (
                <Plus size={14} />
              )}

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

            {/* =================================================
                CATEGORY DROPDOWN
            ================================================= */}
            {dropdownOpen && (
              <div
                className="products-dropdown"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "-100px",
                  width: "280px",
                  backgroundColor: "#030a16",
                  border:
                    "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.6)",
                  padding: "1.5rem",
                  zIndex: 100,
                }}
                /*
                  IMPORTANT:
                  Moving inside dropdown must NOT close it.
                */
                onMouseEnter={() => {
                  setDropdownOpen(true);
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

                {/* =================================================
                    CATEGORY LIST

                    10 categories visible.
                    After 10 -> scrollbar.
                ================================================= */}
                <ul
                  className="category-scroll"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,

                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",

                    /*
                      Approximately 10 categories.
                    */
                    maxHeight: "430px",

                    overflowY: "auto",
                    overflowX: "hidden",

                    paddingRight: "4px",
                  }}
                >
                  {categories.map((cat) => {
                    const isSelected =
                      String(hoveredCategory) ===
                      String(cat._id);

                    return (
                      <li
                        key={cat._id}
                        /*
                          HOVER:
                          Show machinery immediately.
                        */
                        onMouseEnter={() => {
                          setHoveredCategory(cat._id);
                        }}
                        /*
                          CLICK:
                          Lock machinery panel open.
                        */
                        onClick={(e) => {
                          e.stopPropagation();

                          setHoveredCategory(cat._id);

                          setCategoryLocked(true);

                          setDropdownOpen(true);
                        }}
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "6px",

                          backgroundColor: isSelected
                            ? "rgba(56, 189, 248, 0.15)"
                            : "transparent",

                          color: isSelected
                            ? "#38bdf8"
                            : "#cbd5e1",

                          fontWeight: isSelected
                            ? 700
                            : 500,

                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition:
                            "all 0.2s ease",

                          flexShrink: 0,
                        }}
                      >
                        <span>{cat.name}</span>

                        {isSelected ? (
                          <Minus
                            size={13}
                            color="#38bdf8"
                          />
                        ) : (
                          <Plus
                            size={13}
                            color="#94a3b8"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* =================================================
                    MACHINERY PANEL

                    Hover category -> open.
                    Click category -> stay open.
                ================================================= */}
                {hoveredCategory && (
                  <div
                    className="machinery-panel"
                    /*
                      VERY IMPORTANT:
                      This prevents parent mouseLeave from
                      treating movement into this panel
                      as leaving the menu.
                    */
                    onMouseEnter={() => {
                      setDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (!categoryLocked) {
                        setHoveredCategory(null);
                      }
                    }}
                    style={{
                      position: "absolute",

                      top: "-1px",

                      /*
                        8px gap can cause hover to break.
                        Use 0px so cursor can move directly
                        from category box to machinery panel.
                      */
                      left: "100%",

                      width: "400px",

                      backgroundColor: "#030a16",
                      border:
                        "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",

                      boxShadow:
                        "0 20px 40px rgba(0,0,0,0.6)",

                      padding: "1.5rem",

                      zIndex: 101,
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
                      Systems & Machinery
                    </p>

                    {/* Machinery list */}
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                        paddingRight: "4px",
                      }}
                    >
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => {
                          const targetKey =
                            p.slug || p._id;

                          return (
                            <Link
                              key={p._id}
                              href={`/products/${targetKey}`}
                              onClick={() => {
                                closeProductsMenu();
                                setOpen(false);
                              }}
                              style={{
                                padding:
                                  "0.5rem 0.75rem",
                                borderRadius: "6px",
                                color: "#cbd5e1",
                                textDecoration:
                                  "none",
                                fontSize: "0.85rem",
                                fontWeight: 500,
                                transition:
                                  "background 0.2s ease, color 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "rgba(255,255,255,0.06)";

                                e.currentTarget.style.color =
                                  "#38bdf8";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";

                                e.currentTarget.style.color =
                                  "#cbd5e1";
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
                          No equipment found in this
                          category.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ===================================================
              STANDARD NAV LINKS
          =================================================== */}
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href;

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
                style={{
                  position: "relative",
                  paddingBottom: "4px",
                  color: isActive
                    ? "#38bdf8"
                    : "#cbd5e1",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition:
                    "color 0.2s ease",
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

          {/* ===================================================
              DOWNLOADS
          =================================================== */}
          <div
            style={{
              position: "relative",
            }}
            onMouseEnter={() =>
              setDownloadsDropdownOpen(true)
            }
            onMouseLeave={() =>
              setDownloadsDropdownOpen(false)
            }
          >
            <Link
              href="/downloads-pdf"
              onClick={(e) => {
                setOpen(false);

                if (
                  pathname === "/downloads-pdf"
                ) {
                  e.preventDefault();
                }
              }}
              style={{
                position: "relative",
                paddingBottom: "4px",
                color:
                  pathname === "/downloads-pdf"
                    ? "#38bdf8"
                    : "#cbd5e1",
                fontWeight:
                  pathname === "/downloads-pdf"
                    ? 600
                    : 500,
                fontSize: "0.95rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Downloads{" "}
              {downloadsDropdownOpen ? (
                <Minus size={14} />
              ) : (
                <Plus size={14} />
              )}

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

            {/* Downloads Dropdown */}
            {downloadsDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "-120px",
                  width: "340px",
                  backgroundColor: "#030a16",
                  border:
                    "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.6)",
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
                      const pdfId =
                        pdf._id || pdf.id;

                      return (
                        <a
                          key={pdfId}
                          href={pdf.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            setDownloadsDropdownOpen(
                              false
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                            padding:
                              "0.5rem 0.75rem",
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

                            e.currentTarget.style.color =
                              "#38bdf8";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";

                            e.currentTarget.style.color =
                              "#cbd5e1";
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              overflow: "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <FileText
                              size={13}
                              color="#f43f5e"
                            />
                            {pdf.title}
                          </span>

                          <Download
                            size={12}
                            color="#94a3b8"
                          />
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
                      No documents available right
                      now.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              GET QUOTE
          =================================================== */}
          <Link
            href="/contact"
            onClick={(e) => {
              setOpen(false);

              if (pathname === "/contact") {
                e.preventDefault();
              }
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
            Get a quote
            <ArrowRight size={15} />
          </Link>
        </nav>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={
            open ? "Close menu" : "Open menu"
          }
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
          {open ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* =======================================================
          RESPONSIVE
      ======================================================= */}
      <style jsx global>{`
        /* Scrollbar styling */
        .category-scroll::-webkit-scrollbar,
        .machinery-panel
          > div::-webkit-scrollbar {
          width: 5px;
        }

        .category-scroll::-webkit-scrollbar-track,
        .machinery-panel
          > div::-webkit-scrollbar-track {
          background: transparent;
        }

        .category-scroll::-webkit-scrollbar-thumb,
        .machinery-panel
          > div::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.35);
          border-radius: 10px;
        }

        .category-scroll::-webkit-scrollbar-thumb:hover,
        .machinery-panel
          > div::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }

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
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.08);
            box-shadow:
              0 10px 25px -5px
              rgba(0, 0, 0, 0.5);
          }

          .main-nav.is-open {
            display: flex !important;
          }

          /*
            Mobile:
            Machinery panel becomes normal flow
            instead of absolute side panel.
          */
          .machinery-panel {
            position: static !important;
            width: 100% !important;
            margin-top: 0.5rem;
            box-shadow: none !important;
          }

          .products-dropdown {
            position: static !important;
            width: 100% !important;
            margin-top: 0.5rem;
            box-shadow: none !important;
          }

          .products-nav-wrapper {
            width: 100%;
          }

          .category-scroll {
            max-height: 430px !important;
          }
        }
      `}</style>
    </header>
  );
}