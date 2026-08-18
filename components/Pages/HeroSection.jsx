"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  X,
  Megaphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function HeroSection() {
  const [isWaHovered, setIsWaHovered] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Fetch all active announcements (sorted newest first by backend)
  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const res = await fetch(`${API_BASE_URL}/announcements/public`, {
          cache: "no-store",
        });
        const json = await res.json();

        // Agar backend public route multiple active ads array return kare
        const list = Array.isArray(json?.data)
          ? json.data
          : json?.data
            ? [json.data]
            : [];
        const activeList = list.filter((ad) => ad.active);

        if (activeList.length > 0) {
          const hasSeenModal = sessionStorage.getItem(
            "has_seen_hero_announcements",
          );
          if (!hasSeenModal) {
            setAnnouncements(activeList);
            setShowModal(true);
            sessionStorage.setItem("has_seen_hero_announcements", "true");
          }
        }
      } catch (err) {
        console.error("Failed to load hero announcements", err);
      }
    }
    loadAnnouncements();
  }, []);

  const whatsappNumber = "919876543210";
  const whatsappMessage = encodeURIComponent(
    "Hello AFP Technologies Industries, I am interested in inquiring about your machinery catalogue and specifications.",
  );

  const currentAd = announcements[currentIndex];

  const handleNext = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(announcements.length - 1);
    }
  };

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
                Industrial equipment built for the businesses that refuse to
                stand still. Precision, performance, and partnership in every
                machine.
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
                <div className="min-w-0">
                  <strong className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight truncate">
                    25+
                  </strong>
                  <span className="block text-[11px] sm:text-xs md:text-sm text-slate-400 leading-snug sm:leading-normal mt-0.5 sm:mt-1">
                    Years of engineering
                  </span>
                </div>

                <div className="min-w-0">
                  <strong className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight truncate">
                    40
                  </strong>
                  <span className="block text-[11px] sm:text-xs md:text-sm text-slate-400 leading-snug sm:leading-normal mt-0.5 sm:mt-1">
                    Markets served
                  </span>
                </div>

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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
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

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* 🟢 Multiple Announcements Popup Modal with Backdrop Blur & Slider Controls */}
{showModal && currentAd && (
  <div
    className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-slate-900/90 border border-slate-700/80 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl shadow-sky-950/40 text-slate-100 relative animate-in zoom-in-95 duration-200 overflow-hidden backdrop-blur-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Glowing Accent Gradient */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modal Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-inner">
          <Megaphone size={22} />
        </div>
        <div className="flex items-center gap-2.5">
          {announcements.length > 1 && (
            <span className="text-[11px] font-mono font-medium text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full shadow-2xs">
              {currentIndex + 1} / {announcements.length}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Modal Content Body */}
      <div className="space-y-3 relative z-10 min-h-[115px]">
        <div>
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2.5 py-1 rounded-md shadow-2xs">
            {currentAd.badgeText || "SPECIAL ANNOUNCEMENT"}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
          {currentAd.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
          {currentAd.description}
        </p>
      </div>

      {/* Footer Navigation / Actions */}
      <div className="mt-7 pt-4 border-t border-slate-800/80 flex items-center justify-between relative z-10 gap-3">
        {/* Prev / Next Buttons if multiple ads */}
        {announcements.length > 1 ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Previous Announcement"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Next Announcement"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-3.5 py-2 rounded-xl border border-slate-700/80 bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
          {currentAd.linkUrl && (
            <Link
              href={currentAd.linkUrl}
              onClick={() => setShowModal(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <span>{currentAd.linkText || "Explore Now"}</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
)}

      {/* WhatsApp Support Widget */}
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
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="shrink-0"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </aside>
    </>
  );
}
