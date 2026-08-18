"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Cpu, X, Megaphone, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function HeroSection() {
  const [isWaHovered, setIsWaHovered] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Fetch all active announcements (sorted newest first by backend)
  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const res = await fetch(`${API_BASE_URL}/announcements/public`, { cache: 'no-store' });
        const json = await res.json();
        
        // Agar backend public route multiple active ads array return kare
        const list = Array.isArray(json?.data) ? json.data : json?.data ? [json.data] : [];
        const activeList = list.filter((ad) => ad.active);

        if (activeList.length > 0) {
          const hasSeenModal = sessionStorage.getItem("has_seen_hero_announcements");
          if (!hasSeenModal) {
            setAnnouncements(activeList);
            setShowModal(true);
            sessionStorage.setItem("has_seen_hero_announcements", "true");
          }
        }
      } catch (err) {
        console.error('Failed to load hero announcements', err);
      }
    }
    loadAnnouncements();
  }, []);

  const whatsappNumber = "919876543210"; 
  const whatsappMessage = encodeURIComponent(
    "Hello AFP Technologies Industries, I am interested in inquiring about your machinery catalogue and specifications."
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
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl text-slate-100 relative animate-in zoom-in-95 duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glowing Accent Gradient */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Megaphone size={24} />
              </div>
              <div className="flex items-center gap-2">
                {announcements.length > 1 && (
                  <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                    {currentIndex + 1} / {announcements.length}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3 relative z-10 min-h-[110px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-950/80 border border-sky-800/80 px-2.5 py-1 rounded-md">
                {currentAd.badgeText || 'SPECIAL ANNOUNCEMENT'}
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {currentAd.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentAd.description}
              </p>
            </div>

            {/* Footer Navigation / Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between relative z-10 gap-2">
              {/* Prev / Next Buttons if multiple ads */}
              {announcements.length > 1 ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    title="Previous Announcement"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    title="Next Announcement"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
                {currentAd.linkUrl && (
                  <Link
                    href={currentAd.linkUrl}
                    onClick={() => setShowModal(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-900/40 transition-all"
                  >
                    <span>{currentAd.linkText || 'Explore Now'}</span>
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
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
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