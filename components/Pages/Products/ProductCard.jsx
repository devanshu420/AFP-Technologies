"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  if (product && product.active === false) {
    return null;
  }

  const targetId = product?.slug || product?._id;
  const productUrl = `/products/${targetId}`;

  const imageUrl =
    product?.images?.[0]?.url ||
    product?.mainImage?.url ||
    product?.image ||
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=85&fm=jpg";

  const categoryName =
    product?.category?.name ||
    product?.type ||
    "Industrial Machinery";

  const description =
    product?.shortDescription ||
    product?.description ||
    "High-precision industrial manufacturing equipment engineered for maximum throughput and reliability.";

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",

        /* LIGHT BLUE / WHITE CARD */
        background: isHovered
          ? "linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)"
          : "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",

        border: isHovered
          ? "1px solid rgba(14, 165, 233, 0.45)"
          : "1px solid #dbe7f1",

        borderRadius: "15px",
        overflow: "hidden",

        boxShadow: isHovered
          ? "0 18px 40px rgba(15, 23, 42, 0.12), 0 4px 15px rgba(14, 165, 233, 0.08)"
          : "0 8px 24px rgba(15, 23, 42, 0.07)",

        transform: isHovered
          ? "translateY(-5px)"
          : "translateY(0)",

        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
      }}
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}
      <Link
        href={productUrl}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 10",
          overflow: "hidden",
          background: "#eef6fb",
          display: "block",
          textDecoration: "none",
        }}
      >
        <img
          src={imageUrl}
          alt={
            product?.images?.[0]?.alt ||
            product?.name ||
            "Industrial machine"
          }
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",

            transform: isHovered
              ? "scale(1.05)"
              : "scale(1)",

            filter: isHovered
              ? "brightness(1) contrast(1.03)"
              : "brightness(0.96) contrast(1.02)",

            transition:
              "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease",
          }}
        />

        {/* LIGHT IMAGE OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,

            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.02) 20%, rgba(15, 23, 42, 0.08) 60%, rgba(15, 23, 42, 0.42) 100%)",

            pointerEvents: "none",
          }}
        />

        {/* =====================================================
            CATEGORY
        ===================================================== */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",

            display: "inline-flex",
            alignItems: "center",
            gap: "6px",

            padding: "6px 10px",
            borderRadius: "7px",

            /* LIGHT BLUE CATEGORY */
            background: "rgba(255, 255, 255, 0.94)",
            border: "1px solid rgba(14, 165, 233, 0.22)",

            backdropFilter: "blur(8px)",

            fontSize: "0.68rem",
            fontWeight: 700,

            color: "#0369a1",

            letterSpacing: "0.06em",
            textTransform: "uppercase",

            boxShadow: "0 3px 10px rgba(15, 23, 42, 0.08)",
          }}
        >
          <Layers size={11} />
          {categoryName}
        </div>

        {/* =====================================================
            PRODUCT TAG
        ===================================================== */}
        {product?.tag && (
          <span
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",

              padding: "6px 10px",
              borderRadius: "6px",

              background:
                "linear-gradient(135deg, #0284c7, #0369a1)",

              color: "#ffffff",

              fontSize: "0.65rem",
              fontWeight: 700,

              letterSpacing: "0.05em",
              textTransform: "uppercase",

              boxShadow:
                "0 5px 15px rgba(2, 132, 199, 0.25)",
            }}
          >
            {product.tag}
          </span>
        )}

        {/* =====================================================
            VIEW BUTTON
        ===================================================== */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "14px",
            bottom: "14px",

            width: "40px",
            height: "40px",

            borderRadius: "10px",

            background: isHovered
              ? "#0284c7"
              : "rgba(255, 255, 255, 0.94)",

            border: isHovered
              ? "1px solid rgba(255, 255, 255, 0.4)"
              : "1px solid rgba(14, 165, 233, 0.22)",

            color: isHovered
              ? "#ffffff"
              : "#0369a1",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            backdropFilter: "blur(8px)",

            boxShadow: isHovered
              ? "0 8px 20px rgba(2, 132, 199, 0.28)"
              : "0 4px 12px rgba(15, 23, 42, 0.08)",

            transform: isHovered
              ? "scale(1.05)"
              : "scale(1)",

            transition: "all 0.25s ease",
          }}
        >
          <ArrowUpRight size={18} strokeWidth={1.8} />
        </div>
      </Link>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div
        style={{
          padding: "1.3rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* TITLE + DESCRIPTION */}
        <div>
          <h3
            style={{
              margin: "0 0 0.55rem 0",
              lineHeight: 1.3,
            }}
          >
            <Link
              href={productUrl}
              style={{
                fontSize: "1.08rem",
                fontWeight: 700,

                color: isHovered
                  ? "#0369a1"
                  : "#0f172a",

                textDecoration: "none",

                letterSpacing: "-0.01em",

                transition: "color 0.2s ease",

                display: "block",
              }}
            >
              {product?.name}
            </Link>
          </h3>

          <p
            style={{
              color: "#64748b",

              fontSize: "0.84rem",
              lineHeight: 1.6,

              margin: "0 0 1.25rem 0",

              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <div
          style={{
            marginTop: "auto",

            paddingTop: "0.9rem",

            borderTop: "1px solid #e2e8f0",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* STATUS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",

                borderRadius: "50%",

                background: "#0ea5e9",

                boxShadow:
                  "0 0 7px rgba(14, 165, 233, 0.35)",
              }}
            />

            <span
              style={{
                fontSize: "0.72rem",
                color: "#64748b",
                fontWeight: 600,
              }}
            >
              Available
            </span>
          </div>

          {/* DETAILS */}
          <Link
            href={productUrl}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",

              color: isHovered
                ? "#0369a1"
                : "#475569",

              fontSize: "0.8rem",
              fontWeight: 700,

              textDecoration: "none",

              transition: "color 0.2s ease",
            }}
          >
            <span>View Details</span>

            <ArrowUpRight
              size={14}
              style={{
                transform: isHovered
                  ? "translate(2px, -2px)"
                  : "translate(0, 0)",

                transition:
                  "transform 0.2s ease",
              }}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}