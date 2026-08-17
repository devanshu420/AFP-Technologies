"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

export default function ContactSection() {
  const searchParams = useSearchParams();
  const requestedProduct = searchParams?.get("product") || "";
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dynamic Contact Information from Admin Settings
  const [contactInfo, setContactInfo] = useState({
    salesPhoneNumber: "+91 98765 43210",
    inquiryEmail: "contact@machina.industries",
  });

  // Fetch dynamic phone & email from database
  useEffect(() => {
    async function fetchContactSettings() {
      try {
        const res = await fetch(`${apiUrl}/settings/contact`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (res.ok && json.data) {
          setContactInfo({
            salesPhoneNumber:
              json.data.salesPhoneNumber || "+91 98765 43210",
            inquiryEmail:
              json.data.inquiryEmail || "contact@machina.industries",
          });
        }
      } catch (err) {
        console.error("Failed to load contact settings:", err);
      }
    }

    fetchContactSettings();
  }, [apiUrl]);

  useEffect(() => {
    if (requestedProduct) {
      setForm((prev) => ({
        ...prev,
        message:
          prev.message ||
          `I am interested in detailed specifications, quotation, and lead time for: ${requestedProduct}.`,
      }));
    }
  }, [requestedProduct]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiUrl}/enquiries/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          product: requestedProduct || undefined,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", company: "", message: "" });
      } else {
        setError(
          json.message || "Unable to process your request. Please try again."
        );
      }
    } catch {
      setError(
        "Connection to server failed. Please check your internet or retry shortly."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="contact section"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        className="container contact-inner"
        style={{ alignItems: "flex-start" }}
      >
        {/* Left Side: Context, Trust Pointers & Direct Contact Info */}
        <div
          className="contact-info-panel"
          style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
        >
          <div>
            <p className="kicker">
              <span /> DIRECT CONSULTATION
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                lineHeight: 1.15,
                margin: "0.5rem 0 1rem 0",
              }}
            >
              Ready to move
              <br />
              <em>forward?</em>
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "1rem",
                lineHeight: 1.6,
                maxWidth: "440px",
                margin: 0,
              }}
            >
              Connect directly with our engineering & project deployment
              specialists. We help scope, customize, and deliver industrial
              solutions tailored to your production floor.
            </p>
          </div>

          {/* Active Product Inquiry Tag */}
          {requestedProduct && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                backgroundColor: "rgba(56, 189, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                borderRadius: "8px",
                maxWidth: "fit-content",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#38bdf8",
                  boxShadow: "0 0 8px #38bdf8",
                }}
              />
              <span style={{ fontSize: "0.85rem", color: "#e0f2fe" }}>
                Configuring Quote For:{" "}
                <strong style={{ color: "#38bdf8" }}>{requestedProduct}</strong>
              </span>
            </div>
          )}

          {/* ─── Fully Dynamic Contact Details ─── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              paddingTop: "0.5rem",
            }}
          >
            {/* Dynamic Phone */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38bdf8",
                }}
              >
                <Phone size={17} />
              </div>
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Sales & Engineering
                </span>
                <a
                  href={`tel:${contactInfo.salesPhoneNumber.replace(/\s+/g, "")}`}
                  style={{
                    color: "#f1f5f9",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {contactInfo.salesPhoneNumber}
                </a>
              </div>
            </div>

            {/* Dynamic Email */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38bdf8",
                }}
              >
                <Mail size={17} />
              </div>
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Inquiry Desk
                </span>
                <a
                  href={`mailto:${contactInfo.inquiryEmail}`}
                  style={{
                    color: "#f1f5f9",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {contactInfo.inquiryEmail}
                </a>
              </div>
            </div>

            {/* Response SLA */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38bdf8",
                }}
              >
                <Clock size={17} />
              </div>
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Response Time
                </span>
                <span
                  style={{
                    color: "#f1f5f9",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  Within 2–4 business hours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Structured Form */}
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            backgroundColor: "rgba(12, 26, 44, 0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "clamp(1.5rem, 3vw, 2.25rem)",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
          }}
        >
          {submitted ? (
            <div
              style={{
                textAlign: "center",
                padding: "2.5rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  border: "1.5px solid rgba(16, 185, 129, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                  marginBottom: "1.25rem",
                  boxShadow: "0 0 25px rgba(16, 185, 129, 0.2)",
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Enquiry Received
              </h3>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.95rem",
                  lineHeight: 1.65,
                  maxWidth: "420px",
                  marginBottom: "2rem",
                }}
              >
                Thank you for reaching out to AFP Technologies. A confirmation email has
                been dispatched to your inbox, and our engineering desk is
                preparing your proposal.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#f8fafc",
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(56, 189, 248, 0.4)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0284c7";
                  e.currentTarget.style.borderColor = "#38bdf8";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1e293b";
                  e.currentTarget.style.borderColor =
                    "rgba(56, 189, 248, 0.4)";
                  e.currentTarget.style.color = "#f8fafc";
                }}
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.15rem",
              }}
            >
              {/* Row 1: Name & Phone */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "0.85rem",
                    color: "#cbd5e1",
                  }}
                >
                  Full Name *
                  <input
                    required
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",
                      padding: "0.75rem 0.9rem",
                      color: "#f8fafc",
                      outline: "none",
                    }}
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "0.85rem",
                    color: "#cbd5e1",
                  }}
                >
                  Phone Number *
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",
                      padding: "0.75rem 0.9rem",
                      color: "#f8fafc",
                      outline: "none",
                    }}
                  />
                </label>
              </div>

              {/* Row 2: Work Email & Company */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "0.85rem",
                    color: "#cbd5e1",
                  }}
                >
                  Work Email *
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",
                      padding: "0.75rem 0.9rem",
                      color: "#f8fafc",
                      outline: "none",
                    }}
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "0.85rem",
                    color: "#cbd5e1",
                  }}
                >
                  Company / Factory
                  <input
                    placeholder="Organization name (optional)"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",
                      padding: "0.75rem 0.9rem",
                      color: "#f8fafc",
                      outline: "none",
                    }}
                  />
                </label>
              </div>

              {/* Row 3: Message */}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "0.85rem",
                  color: "#cbd5e1",
                }}
              >
                Project Scope & Requirements
                <textarea
                  rows={4}
                  placeholder="Describe your throughput requirements, plant location, or delivery timeline..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    padding: "0.75rem 0.9rem",
                    color: "#f8fafc",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </label>

              {/* Error Alert */}
              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    color: "#fca5a5",
                    fontSize: "0.85rem",
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                className="button primary"
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "0.85rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  marginTop: "0.25rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Transmitting Enquiry..."
                  : "Submit Commercial Enquiry"}{" "}
                <ArrowRight size={17} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}