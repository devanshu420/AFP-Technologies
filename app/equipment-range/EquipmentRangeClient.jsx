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
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="equipment-page">
      <Nav />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="equipment-hero">
        <div className="equipment-hero-inner">
          <p className="equipment-eyebrow">
            Our Equipment
          </p>

          <h1 className="equipment-title">
            Equipment Range
          </h1>

          <p className="equipment-subtitle">
            Explore our complete range of industrial machinery
            and food processing equipment.
          </p>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <main className="equipment-main">
        {products.length === 0 ? (
          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="equipment-empty">
            <div className="empty-icon">
              <ImageIcon size={28} />
            </div>

            <h2>
              No equipment available
            </h2>

            <p>
              Equipment will appear here once available.
            </p>
          </div>
        ) : (
          /* =================================================
             GRID
          ================================================= */

          <div className="equipment-grid">
            {products.map((product) => {
              const image = getImage(product);
              const isOpen = openId === product._id;

              return (
                <article
                  key={product._id}
                  className={`equipment-card ${
                    isOpen ? "is-open" : ""
                  }`}
                >
                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="equipment-image">
                    {image ? (
                      <img
                        src={image}
                        alt={
                          product?.image?.alt ||
                          product?.name ||
                          "Equipment"
                        }
                      />
                    ) : (
                      <div className="image-placeholder">
                        <div className="placeholder-icon">
                          <ImageIcon size={24} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* =================================================
                      HEADER / ACCORDION
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleAccordion(product._id)
                    }
                    aria-expanded={isOpen}
                    className="equipment-header"
                  >
                    <div className="equipment-header-content">
                      <span className="equipment-name">
                        {product?.name ||
                          "Unnamed Equipment"}
                      </span>

                      <span className="equipment-action">
                        {isOpen
                          ? "Hide description"
                          : "View description"}
                      </span>
                    </div>

                    <span
                      className={`accordion-icon ${
                        isOpen ? "active" : ""
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
                    className={`equipment-description-wrapper ${
                      isOpen ? "open" : ""
                    }`}
                  >
                    <div className="equipment-description-inner">
                      <div className="description-content">
                        <p>
                          {product?.description ||
                            product?.shortDescription ||
                            "No description available."}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

      {/* =====================================================
          RESPONSIVE CSS
      ===================================================== */}

      <style jsx>{`
        /* =====================================================
           PAGE STRUCTURE
        ===================================================== */

        .equipment-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .equipment-main {
          width: 100%;
          max-width: 1152px;
          margin: 0 auto;
          padding: 36px 24px 48px;
          box-sizing: border-box;
          flex: 1;
        }

        /* =====================================================
           HERO
        ===================================================== */

        .equipment-hero {
          width: 100%;
          background: #071b32;
          color: #ffffff;
        }

        .equipment-hero-inner {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 52px clamp(20px, 5vw, 64px);
          box-sizing: border-box;
        }

        .equipment-eyebrow {
          margin: 0;
          color: #38bdf8;
          font-size: 10px;
          line-height: 1.4;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .equipment-title {
          margin: 10px 0 0;
          color: #ffffff;
          font-size: clamp(30px, 4vw, 42px);
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .equipment-subtitle {
          max-width: 620px;
          margin: 13px 0 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.7;
        }

        /* =====================================================
           GRID
        ===================================================== */

        .equipment-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
        }

        /* =====================================================
           CARD
        ===================================================== */

        .equipment-card {
          min-width: 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;

          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.04);

          transition:
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .equipment-card:hover {
          border-color: #cbd5e1;
          box-shadow:
            0 5px 16px rgba(15, 23, 42, 0.07);
        }

        .equipment-card.is-open {
          border-color: #cbd5e1;
        }

        /* =====================================================
           IMAGE
        ===================================================== */

        .equipment-image {
          position: relative;
          width: 100%;
          height: 176px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .equipment-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;

          transition:
            transform 0.5s ease;
        }

        .equipment-card:hover .equipment-image img {
          transform: scale(1.03);
        }

        /* =====================================================
           IMAGE PLACEHOLDER
        ===================================================== */

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;

          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;

          color: #cbd5e1;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .equipment-header {
          width: 100%;
          min-width: 0;

          display: flex;
          align-items: center;
          gap: 12px;

          padding: 14px;
          margin: 0;

          border: 0;
          background: transparent;

          text-align: left;
          cursor: pointer;

          box-sizing: border-box;
          color: inherit;

          -webkit-tap-highlight-color: transparent;
        }

        .equipment-header-content {
          flex: 1;
          min-width: 0;
        }

        .equipment-name {
          display: block;

          width: 100%;

          color: #0f172a;
          font-size: 14px;
          line-height: 1.45;
          font-weight: 700;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .equipment-action {
          display: block;

          margin-top: 4px;

          color: #94a3b8;
          font-size: 10px;
          line-height: 1.4;
        }

        /* =====================================================
           ACCORDION ICON
        ===================================================== */

        .accordion-icon {
          width: 28px;
          height: 28px;
          min-width: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #f1f5f9;
          color: #64748b;

          transition:
            background-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .accordion-icon.active {
          background: #f0f9ff;
          color: #0284c7;
        }

        /* =====================================================
           DESCRIPTION ACCORDION
        ===================================================== */

        .equipment-description-wrapper {
          display: grid;
          grid-template-rows: 0fr;

          transition:
            grid-template-rows 0.3s ease;
        }

        .equipment-description-wrapper.open {
          grid-template-rows: 1fr;
        }

        .equipment-description-inner {
          min-height: 0;
          overflow: hidden;
        }

        .description-content {
          margin: 0 14px;
          padding: 0 0 16px;
          border-top: 1px solid #f1f5f9;
        }

        .description-content p {
          margin: 12px 0 0;

          color: #475569;
          font-size: 12px;
          line-height: 1.7;

          white-space: pre-line;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        /* =====================================================
           EMPTY STATE
        ===================================================== */

        .equipment-empty {
          width: 100%;
          box-sizing: border-box;

          padding: 48px 24px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          text-align: center;

          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .empty-icon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 14px;

          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;

          color: #cbd5e1;
        }

        .equipment-empty h2 {
          margin: 0;

          color: #1e293b;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 700;
        }

        .equipment-empty p {
          margin: 5px 0 0;

          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =====================================================
           LARGE TABLET
        ===================================================== */

        @media (max-width: 1100px) {
          .equipment-main {
            max-width: 100%;
            padding-left: 28px;
            padding-right: 28px;
          }

          .equipment-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 768px) {
          .equipment-hero-inner {
            padding: 44px 24px;
          }

          .equipment-main {
            padding: 30px 20px 40px;
          }

          .equipment-grid {
            gap: 15px;
          }

          .equipment-image {
            height: 170px;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 640px) {
          .equipment-hero-inner {
            padding: 38px 20px 40px;
          }

          .equipment-title {
            font-size: 30px;
          }

          .equipment-subtitle {
            max-width: 100%;
            font-size: 13px;
            line-height: 1.65;
          }

          .equipment-main {
            padding: 24px 16px 36px;
          }

          .equipment-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .equipment-image {
            height: 190px;
          }

          .equipment-header {
            padding: 14px;
          }

          .equipment-name {
            font-size: 14px;
          }

          .description-content {
            margin-left: 14px;
            margin-right: 14px;
          }
        }

        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 400px) {
          .equipment-hero-inner {
            padding: 34px 16px 36px;
          }

          .equipment-main {
            padding: 20px 12px 30px;
          }

          .equipment-title {
            font-size: 27px;
          }

          .equipment-subtitle {
            font-size: 12px;
          }

          .equipment-image {
            height: 175px;
          }

          .equipment-header {
            padding: 12px;
            gap: 9px;
          }

          .equipment-name {
            font-size: 13px;
          }

          .accordion-icon {
            width: 27px;
            height: 27px;
            min-width: 27px;
          }

          .equipment-empty {
            padding: 40px 18px;
          }
        }
      `}</style>
    </div>
  );
}