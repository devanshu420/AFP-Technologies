"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Cpu, MessageCircle } from "lucide-react";

export default function HeroSection() {
  const [isWaHovered, setIsWaHovered] = useState(false);

  // Apna WhatsApp number yahan set karein (Country code ke saath, bina + ya spaces ke)
  const whatsappNumber = "919876543210"; 
  const whatsappMessage = encodeURIComponent(
    "Hello AFP Technologies Industries, I am interested in inquiring about your machinery catalogue and specifications."
  );

  return (
    <>
      <section
        className="hero"
        style={{
          position: "relative",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          background:
            "radial-gradient(ellipse at 50% 15%, #0a2344 0%, #061324 70%, #030812 100%)",
          overflow: "hidden",
          padding: "5rem 0",
        }}
      >
        {/* Subtle Background Radial & Grid Effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(circle at 50% 40%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 40%, black 30%, transparent 80%)",
            pointerEvents: "none",
          }}
        />

        {/* Main Content Wrapper */}
        <div
          className="container"
          style={{
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 4vw, 3.5rem)",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            className="hero-inner"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "clamp(2.5rem, 5vw, 4.5rem)",
              alignItems: "center",
            }}
          >
            {/* Left Column: Typography, CTAs & Metrics */}
            <div className="hero-copy" style={{ maxWidth: "600px" }}>
              {/* Top Live Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(56, 189, 248, 0.08)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  marginBottom: "1.25rem",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#38bdf8",
                    boxShadow: "0 0 10px #38bdf8",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                    color: "#e0f2fe",
                    textTransform: "uppercase",
                  }}
                >
                  Engineering the next standard
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.4rem, 4.5vw, 3.75rem)",
                  lineHeight: 1.12,
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.025em",
                  margin: "0 0 1.25rem 0",
                }}
              >
                Powering{" "}
                <em
                  style={{
                    fontStyle: "normal",
                    background:
                      "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  progress
                </em>
                <br />
                through machinery.
              </h1>

              <p
                className="hero-lede"
                style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                  lineHeight: 1.65,
                  color: "#94a3b8",
                  marginBottom: "2.25rem",
                }}
              >
                Industrial equipment built for the businesses that refuse to stand
                still. Precision, performance, and partnership in every machine.
              </p>

              {/* Action Buttons */}
              <div
                className="hero-actions"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "2.5rem",
                }}
              >
                <Link
                  className="button primary"
                  href="/products"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.85rem 1.6rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    boxShadow: "0 0 20px rgba(2, 132, 199, 0.35)",
                    textDecoration: "none",
                  }}
                >
                  Explore products <ArrowRight size={17} />
                </Link>

                <Link
                  className="button ghost"
                  href="/about"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.85rem 1.6rem",
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#e2e8f0",
                    textDecoration: "none",
                  }}
                >
                  Why AFP Technologies <ArrowRight size={17} />
                </Link>
              </div>

              {/* Stats Metrics */}
              <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 border-t border-white/10 pt-4 sm:pt-6">
  {/* Stat 1 */}
  <div className="min-w-0">
    <strong className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight truncate">
      25+
    </strong>
    <span className="block text-[11px] sm:text-xs md:text-sm text-slate-400 leading-snug sm:leading-normal mt-0.5 sm:mt-1">
      Years of engineering
    </span>
  </div>

  {/* Stat 2 */}
  <div className="min-w-0">
    <strong className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight truncate">
      40
    </strong>
    <span className="block text-[11px] sm:text-xs md:text-sm text-slate-400 leading-snug sm:leading-normal mt-0.5 sm:mt-1">
      Markets served
    </span>
  </div>

  {/* Stat 3 */}
  <div className="min-w-0">
    <strong className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-sky-400 tracking-tight truncate">
      98%
    </strong>
    <span className="block text-[11px] sm:text-xs md:text-sm text-slate-400 leading-snug sm:leading-normal mt-0.5 sm:mt-1">
      Customer retention
    </span>
  </div>
</div>
            </div>

            {/* Right Column: Machine Showcase Image */}
            <div
              className="hero-visual"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div
                className="visual-frame"
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "680px",
                  borderRadius: "20px",
                  padding: "14px",
                  backgroundColor: "rgba(15, 23, 42, 0.85)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* 1. Full Clean Image Box */}
                <div
                  style={{
                    position: "relative",
                    borderRadius: "14px",
                    overflow: "hidden",
                    width: "100%",
                    height: "380px",
                    backgroundColor: "#020617",
                  }}
                >
                  <img
                    src="https://ik.imagekit.io/asdf5690/Machine/image3.jpeg"
                    alt="CNC industrial machinery in active production facility"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                      filter: "contrast(1.05) brightness(0.96)",
                    }}
                  />
                </div>

                {/* 2. Below-Image Dedicated Specs & Live Status Bar */}
                <div
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(7, 27, 50, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {/* Left: Machine Info */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(56, 189, 248, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Cpu size={17} color="#38bdf8" />
                    </div>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.86rem",
                          color: "#f1f5f9",
                          fontWeight: 600,
                        }}
                      >
                        High-Precision Automated CNC Unit
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                        Smart Telemetry & Precision PLC
                      </span>
                    </div>
                  </div>

                  {/* Right: Live Systems Badge */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <div
                      style={{
                        backgroundColor: "rgba(3, 7, 18, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "9999px",
                        padding: "5px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        color: "#f8fafc",
                      }}
                    >
                      <span
                        className="pulse"
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          backgroundColor: "#10b981",
                          boxShadow: "0 0 8px #10b981",
                        }}
                      />
                      LIVE SYSTEMS / 04 ACTIVE
                    </div>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#38bdf8",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(56, 189, 248, 0.1)",
                      }}
                    >
                      99.9% UPTIME
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 Modern Sleek Floating WhatsApp Support Widget */}
      <aside
        aria-label="Contact via WhatsApp"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Floating Tooltip Card on Left (Smooth Fade & Slide) */}
        <div
          style={{
            pointerEvents: "none",
            backgroundColor: "rgba(10, 25, 47, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            padding: "8px 14px",
            boxShadow: "0 12px 30px -5px rgba(0, 0, 0, 0.6)",
            opacity: isWaHovered ? 1 : 0,
            transform: isWaHovered ? "translateX(0) scale(1)" : "translateX(10px) scale(0.95)",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>
            Chat with Engineering
          </span>
          <span style={{ fontSize: "0.72rem", color: "#34d399", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34d399" }} />
            Online for Quick Quotes
          </span>
        </div>

        {/* WhatsApp Circular Action Trigger */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsWaHovered(true)}
          onMouseLeave={() => setIsWaHovered(false)}
          aria-label="Open WhatsApp chat"
          style={{
            position: "relative",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#25D366",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            textDecoration: "none",
            boxShadow: isWaHovered
              ? "0 10px 28px rgba(37, 211, 102, 0.55), 0 0 20px rgba(37, 211, 102, 0.4)"
              : "0 8px 20px rgba(0, 0, 0, 0.35), 0 0 12px rgba(37, 211, 102, 0.25)",
            transform: isWaHovered ? "scale(1.1) translateY(-3px)" : "scale(1)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {/* Subtle Online Active Dot Badge on Top-Right of Icon */}
          <span
            style={{
              position: "absolute",
              top: "3px",
              right: "3px",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              border: "2px solid #061324",
              boxShadow: "0 0 8px #10b981",
            }}
          />

          {/* Official Clean WhatsApp Vector SVG */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              transform: isWaHovered ? "rotate(-8deg) scale(1.05)" : "rotate(0) scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            <path
              d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1s-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-.9-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.3 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3 3.6 1.5 3.6 1 4.2.9.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.5Z"
              fill="#ffffff"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5.1-1.3C8.5 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.8 14.8 3.4 13.4 3.4 12c0-4.7 3.9-8.6 8.6-8.6s8.6 3.9 8.6 8.6-3.9 8.6-8.6 8.6Z"
              fill="#ffffff"
            />
          </svg>
        </a>
      </aside>
    </>
  );
}