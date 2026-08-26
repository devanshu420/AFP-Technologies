"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";

import Nav from "../../components/Pages/Nav";
import Footer from "../../components/Pages/Footer";

export default function EquipmentRangeClient({
  products = [],
}) {
  const [openId, setOpenId] = useState(null);

  /*
  =========================================================
  IMAGE HELPER
  =========================================================

  New EquipmentRange model:

  image: {
    url,
    fileId,
    alt
  }

  =========================================================
  */

  const getImage = (product) => {
    return (
      product?.image?.url ||
      product?.mainImage?.url ||
      product?.images?.[0]?.url ||
      null
    );
  };


  /*
  =========================================================
  TOGGLE ACCORDION
  =========================================================
  */

  const toggleAccordion = (id) => {
    setOpenId((prev) =>
      prev === id ? null : id
    );
  };


  return (
    <div className="min-h-screen bg-slate-50">

      <Nav />


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-[#071b32] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

          <p className="text-[10px] uppercase tracking-[0.2em] text-sky-400 font-bold">
            Our Equipment
          </p>

          <h1 className="mt-2.5 text-3xl sm:text-4xl font-bold tracking-tight">
            Equipment Range
          </h1>

          <p className="mt-3 max-w-xl text-sm text-slate-300 leading-6">
            Explore our complete range of industrial machinery
            and food processing equipment.
          </p>

        </div>
      </section>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-9 sm:py-12">

        {products.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

            <ImageIcon
              size={32}
              className="mx-auto text-slate-300 mb-3"
            />

            <h2 className="text-sm font-bold text-slate-800">
              No equipment available
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Equipment will appear here once available.
            </p>

          </div>

        ) : (

          /* =================================================
             GRID
          ================================================= */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {products.map((product) => {

              const image = getImage(product);

              const isOpen =
                openId === product._id;


              return (
                <article
                  key={product._id}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="relative w-full h-40 sm:h-44 bg-slate-100 overflow-hidden">

                    {image ? (

                      <img
                        src={image}
                        alt={
                          product?.image?.alt ||
                          product.name ||
                          "Equipment"
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center">

                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center">

                          <ImageIcon
                            size={24}
                            className="text-slate-300"
                          />

                        </div>

                      </div>

                    )}

                  </div>


                  {/* =================================================
                      HEADER
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleAccordion(product._id)
                    }
                    className="w-full text-left px-3.5 py-3.5 flex items-center gap-3 cursor-pointer"
                  >

                    <div className="flex-1 min-w-0">

                      <span className="block text-sm font-bold text-slate-900 leading-5 truncate">
                        {product.name ||
                          "Unnamed Equipment"}
                      </span>

                      <p className="text-[10px] text-slate-400 mt-1">
                        {isOpen
                          ? "Hide description"
                          : "View description"}
                      </p>

                    </div>


                    {/* ACCORDION BUTTON */}

                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? "bg-sky-50 text-sky-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >

                      {isOpen ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}

                    </span>

                  </button>


                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >

                    <div className="overflow-hidden">

                      <div className="px-3.5 pb-4">

                        <div className="border-t border-slate-100 pt-3">

                          <p className="text-xs text-slate-600 leading-6 whitespace-pre-line">
                            {product.description ||
                              product.shortDescription ||
                              "No description available."}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </main>


      <Footer />

    </div>
  );
}