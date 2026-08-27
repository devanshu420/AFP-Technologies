"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

import NavDropdown from "./Nav/NavDropDownMenu";
import NavSearch from "./Nav/NavSearch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* =========================================================
   NAV CACHE
========================================================= */

let navCache = {
  categories: null,
  products: null,
  downloads: null,
  equipmentRange: null,
  timestamp: null,
};

const CACHE_DURATION = 5 * 60 * 1000;

/* =========================================================
   NAV COMPONENT
========================================================= */

export default function Nav() {
  const [open, setOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [downloadsList, setDownloadsList] = useState([]);
  const [equipmentRange, setEquipmentRange] = useState([]);

  const pathname = usePathname();

  /* =========================================================
     LOAD NAVIGATION DATA
  ========================================================= */

  useEffect(() => {
    async function fetchNavData() {
      const now = Date.now();

      /* =====================================================
         USE CACHE
      ===================================================== */

      if (
        navCache.categories &&
        navCache.products &&
        navCache.downloads &&
        navCache.equipmentRange &&
        navCache.timestamp &&
        now - navCache.timestamp < CACHE_DURATION
      ) {
        setCategories(navCache.categories);
        setProducts(navCache.products);
        setDownloadsList(navCache.downloads);
        setEquipmentRange(navCache.equipmentRange);

        return;
      }

      try {
        const [
          catRes,
          prodRes,
          downRes,
          equipmentRes,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/products?limit=100`),
          fetch(
            `${API_BASE_URL}/downloads/public?limit=20`
          ),
          fetch(`${API_BASE_URL}/equipment-range`),
        ]);

        /* =====================================================
           PARSE RESPONSES
        ===================================================== */

        const [
          catJson,
          prodJson,
          downJson,
          equipmentJson,
        ] = await Promise.all([
          catRes.json(),
          prodRes.json(),
          downRes.json(),
          equipmentRes.json(),
        ]);

        /* =====================================================
           CATEGORIES
        ===================================================== */

        const catList = Array.isArray(catJson?.data)
          ? catJson.data
          : [];

        /* =====================================================
           PRODUCTS
        ===================================================== */

        const prodList = Array.isArray(
          prodJson?.data?.products
        )
          ? prodJson.data.products
          : Array.isArray(prodJson?.data)
            ? prodJson.data
            : [];

        /* =====================================================
           DOWNLOADS
        ===================================================== */

        const pdfList = Array.isArray(downJson?.data)
          ? downJson.data
          : Array.isArray(downJson?.data?.data)
            ? downJson.data.data
            : [];

        /* =====================================================
           EQUIPMENT RANGE
        ===================================================== */

        const equipmentList = Array.isArray(
          equipmentJson?.data
        )
          ? equipmentJson.data
          : [];

        /* =====================================================
           SAVE CACHE
        ===================================================== */

        navCache = {
          categories: catList,
          products: prodList,
          downloads: pdfList,
          equipmentRange: equipmentList,
          timestamp: Date.now(),
        };

        /* =====================================================
           UPDATE STATE
        ===================================================== */

        setCategories(catList);
        setProducts(prodList);
        setDownloadsList(pdfList);
        setEquipmentRange(equipmentList);
      } catch (err) {
        console.error(
          "Failed to load navigation data:",
          err
        );
      }
    }

    fetchNavData();
  }, []);

  /* =========================================================
     STANDARD NAV LINKS
  ========================================================= */

  const navLinks = [
    {
      name: "About us",
      href: "/about",
    },
  ];

  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  const closeMobileMenu = () => {
    setOpen(false);
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <header className="navbar-v2 sticky top-0 z-50 bg-[#071b32] border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4 relative">

        {/* ===================================================
            BRAND LOGO
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
            DESKTOP SEARCH
        =================================================== */}

        <div className="hidden md:flex flex-1 max-w-sm mx-auto">
          <NavSearch
            onCloseMenu={closeMobileMenu}
          />
        </div>

        {/* ===================================================
            NAVIGATION
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

          <div className="w-full md:hidden mb-2">
            <NavSearch
              mobile={true}
              onCloseMenu={closeMobileMenu}
            />
          </div>

          {/* =================================================
              ALL DROPDOWNS
          ================================================= */}

          <NavDropdown
            pathname={pathname}
            categories={categories}
            products={products}
            equipmentRange={equipmentRange}
            downloadsList={downloadsList}
            onCloseMenu={closeMobileMenu}
          />

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
                  closeMobileMenu();

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
              GET A QUOTE
          ================================================= */}

          <Link
            href="/contact"
            onClick={(e) => {
              closeMobileMenu();

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
          aria-label={
            open ? "Close menu" : "Open menu"
          }
          className="md:hidden text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          {open ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>
    </header>
  );
}