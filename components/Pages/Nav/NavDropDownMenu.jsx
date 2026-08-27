"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, FileText, Download } from "lucide-react";

export default function NavDropdown({
  pathname,
  categories = [],
  products = [],
  equipmentRange = [],
  downloadsList = [],
  onCloseMenu,
}) {
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const [equipmentDropdownOpen, setEquipmentDropdownOpen] = useState(false);

  const [downloadsDropdownOpen, setDownloadsDropdownOpen] = useState(false);

  const [hoveredCategory, setHoveredCategory] = useState(null);

  /* =========================================================
     CATEGORY FILTER
  ========================================================= */

  const filteredProducts = products.filter((product) => {
    if (!hoveredCategory) return false;

    const productCategoryId =
      product.category?._id || product.category;

    return (
      String(productCategoryId) ===
      String(hoveredCategory)
    );
  });

  /* =========================================================
     CLOSE PRODUCTS MENU
  ========================================================= */

  const closeProductsMenu = () => {
    setProductsDropdownOpen(false);
    setHoveredCategory(null);
  };

  /* =========================================================
     OPEN PRODUCTS MENU
  ========================================================= */

  const openProductsMenu = () => {
    setProductsDropdownOpen(true);

    if (!hoveredCategory && categories.length > 0) {
      setHoveredCategory(categories[0]._id);
    }
  };

  /* =========================================================
     PRODUCTS DROPDOWN
  ========================================================= */

  return (
    <>
      {/* =====================================================
          PRODUCTS DROPDOWN
      ===================================================== */}

      <div
        className="relative"
        onMouseEnter={openProductsMenu}
        onMouseLeave={closeProductsMenu}
      >
        {/* ===================================================
            PRODUCTS NAV LINK
        =================================================== */}

        <Link
          href="/products"
          onClick={(e) => {
            onCloseMenu?.();

            if (pathname === "/products") {
              e.preventDefault();
            }

            openProductsMenu();
          }}
          className={`relative pb-1 text-xs sm:text-sm font-medium inline-flex items-center gap-1 transition-colors ${
            pathname === "/products"
              ? "text-sky-400 font-semibold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Products

          {productsDropdownOpen ? (
            <Minus size={12} />
          ) : (
            <Plus size={12} />
          )}

          {pathname === "/products" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />
          )}
        </Link>

        {/* ===================================================
            MAIN PRODUCTS DROPDOWN

            IMPORTANT:
            top-full + NO mt-1
            So there is no mouse gap.
        =================================================== */}

        {productsDropdownOpen && (
          <div
            className="
              absolute
              top-full
              -left-20
              w-[280px]
              bg-[#030a16]
              border
              border-white/10
              rounded-xl
              shadow-2xl
              p-3
              z-[100]
            "
            onMouseEnter={() => {
              setProductsDropdownOpen(true);
            }}
          >
            <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2">
              Categories
            </p>

            <ul className="max-h-[300px] overflow-y-auto space-y-1 pr-1">
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const isSelected =
                    String(hoveredCategory) ===
                    String(cat._id);

                  return (
                    <li
                      key={cat._id}
                      onMouseEnter={() => {
                        setHoveredCategory(cat._id);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();

                        setHoveredCategory(cat._id);
                        setProductsDropdownOpen(true);
                      }}
                      className={`
                        flex
                        items-center
                        justify-between
                        px-2.5
                        py-1.5
                        rounded-md
                        text-xs
                        cursor-pointer
                        transition-all
                        ${
                          isSelected
                            ? "bg-sky-500/15 text-sky-400 font-bold"
                            : "text-slate-300 hover:bg-white/5"
                        }
                      `}
                    >
                      <span className="truncate">
                        {cat.name}
                      </span>

                      {isSelected ? (
                        <Minus
                          size={11}
                          className="text-sky-400 shrink-0"
                        />
                      ) : (
                        <Plus
                          size={11}
                          className="text-slate-500 shrink-0"
                        />
                      )}
                    </li>
                  );
                })
              ) : (
                <li className="text-[11px] text-slate-500 italic px-2 py-1">
                  No categories available.
                </li>
              )}
            </ul>

            {/* ===============================================
                PRODUCTS SUB PANEL

                IMPORTANT:
                left-full + NO ml-1.5

                This removes the gap between the two panels.
            =============================================== */}

            {hoveredCategory && (
              <div
                className="
                  absolute
                  top-0
                  left-full
                  w-[300px]
                  bg-[#030a16]
                  border
                  border-white/10
                  rounded-xl
                  shadow-2xl
                  p-3
                  z-[110]
                "
                onMouseEnter={() => {
                  setProductsDropdownOpen(true);
                }}
              >
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2">
                  Systems & Machinery
                </p>

                <div className="max-h-[280px] overflow-y-auto space-y-1">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${
                          product.slug || product._id
                        }`}
                        onClick={() => {
                          closeProductsMenu();
                          onCloseMenu?.();
                        }}
                        className="
                          block
                          px-2.5
                          py-1.5
                          rounded-md
                          text-xs
                          text-slate-300
                          hover:text-sky-400
                          hover:bg-white/5
                          transition-colors
                          truncate
                        "
                      >
                        • {product.name}
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

      {/* =====================================================
          EQUIPMENT RANGE DROPDOWN
      ===================================================== */}

      <div
        className="relative"
        onMouseEnter={() => {
          setEquipmentDropdownOpen(true);
        }}
        onMouseLeave={() => {
          setEquipmentDropdownOpen(false);
        }}
      >
        <Link
          href="/equipment-range"
          onClick={(e) => {
            onCloseMenu?.();

            if (pathname === "/equipment-range") {
              e.preventDefault();
            }
          }}
          className={`relative pb-1 text-xs sm:text-sm font-medium inline-flex items-center gap-1 transition-colors ${
            pathname === "/equipment-range"
              ? "text-sky-400 font-semibold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Equipment Range

          {equipmentDropdownOpen ? (
            <Minus size={12} />
          ) : (
            <Plus size={12} />
          )}

          {pathname === "/equipment-range" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />
          )}
        </Link>

        {equipmentDropdownOpen && (
          <div
            className="
              absolute
              top-full
              -left-20
              w-[300px]
              bg-[#030a16]
              border
              border-white/10
              rounded-xl
              shadow-2xl
              p-3
              z-[100]
            "
          >
            <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2">
              Equipment Range
            </p>

            <div className="max-h-[300px] overflow-y-auto space-y-1">
              {equipmentRange.length > 0 ? (
                equipmentRange.map((equipment) => (
                  <Link
                    key={equipment._id}
                    href="/equipment-range"
                    onClick={() => {
                      setEquipmentDropdownOpen(false);
                      onCloseMenu?.();
                    }}
                    className="
                      block
                      px-2.5
                      py-2
                      rounded-md
                      text-xs
                      text-slate-300
                      hover:text-sky-400
                      hover:bg-white/5
                      transition-colors
                    "
                  >
                    <span className="block truncate font-medium">
                      {equipment.name}
                    </span>

                    {equipment.shortDescription && (
                      <span className="block text-[10px] text-slate-500 mt-0.5 truncate">
                        {equipment.shortDescription}
                      </span>
                    )}
                  </Link>
                ))
              ) : (
                <span className="text-[11px] text-slate-500 italic px-2 py-1 block">
                  No equipment range available.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          DOWNLOADS DROPDOWN
      ===================================================== */}

      <div
        className="relative"
        onMouseEnter={() => {
          setDownloadsDropdownOpen(true);
        }}
        onMouseLeave={() => {
          setDownloadsDropdownOpen(false);
        }}
      >
        <Link
          href="/downloads-pdf"
          onClick={(e) => {
            onCloseMenu?.();

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
          Downloads

          {downloadsDropdownOpen ? (
            <Minus size={12} />
          ) : (
            <Plus size={12} />
          )}

          {pathname === "/downloads-pdf" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />
          )}
        </Link>

        {downloadsDropdownOpen && (
          <div
            className="
              absolute
              top-full
              -left-20
              w-[300px]
              bg-[#030a16]
              border
              border-white/10
              rounded-xl
              shadow-2xl
              p-3
              z-[100]
            "
          >
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
                    onClick={() => {
                      setDownloadsDropdownOpen(false);
                      onCloseMenu?.();
                    }}
                    className="
                      flex
                      items-center
                      justify-between
                      px-2.5
                      py-1.5
                      rounded-md
                      text-xs
                      text-slate-300
                      hover:text-sky-400
                      hover:bg-white/5
                      transition-colors
                    "
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FileText
                        size={12}
                        className="text-rose-500 shrink-0"
                      />

                      <span className="truncate">
                        {pdf.title}
                      </span>
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
    </>
  );
}