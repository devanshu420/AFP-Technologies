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
  MessageSquare,
} from "lucide-react";

export default function ContactSection() {
  const searchParams = useSearchParams();
  const requestedProduct = searchParams?.get("product") || "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
            salesPhoneNumber: json.data.salesPhoneNumber || "+91 98765 43210",
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

  // ── Clean dynamic number for WhatsApp Redirect ──
  // Removes all +, spaces, dashes, brackets etc.
  const rawCleanPhone = contactInfo.salesPhoneNumber.replace(/\D/g, "");
  // Default country code 91 if user only provided 10 digits
  const whatsappNumber =
    rawCleanPhone.length === 10 ? `91${rawCleanPhone}` : rawCleanPhone;

  // Custom pre-filled message for WhatsApp
  const whatsappCustomMessage = encodeURIComponent(
    requestedProduct
      ? `Hello AFP Technologies, I want to inquire about: ${requestedProduct}.`
      : `Hello AFP Technologies, I would like to consult about your industrial machinery solutions.`,
  );

  const whatsappRedirectUrl = `https://wa.me/${whatsappNumber}?text=${whatsappCustomMessage}`;

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
          json.message || "Unable to process your request. Please try again.",
        );
      }
    } catch {
      setError(
        "Connection to server failed. Please check your internet or retry shortly.",
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
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
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

          {/* ─── Fully Dynamic Contact Details + WhatsApp CTA ─── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              paddingTop: "0.25rem",
            }}
          >
            {/* 1. Dynamic WhatsApp Quick Connect Card */}
            <a
              href={whatsappRedirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "10px 14px",
                backgroundColor: "rgba(37, 211, 102, 0.08)",
                border: "1px solid rgba(37, 211, 102, 0.35)",
                borderRadius: "10px",
                textDecoration: "none",
                transition: "all 0.2s ease",
                maxWidth: "380px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(37, 211, 102, 0.16)";
                e.currentTarget.style.borderColor = "#25d366";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(37, 211, 102, 0.08)";
                e.currentTarget.style.borderColor = "rgba(37, 211, 102, 0.35)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "8px",
                    backgroundColor: "#25d366",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                    boxShadow: "0 0 12px rgba(37, 211, 102, 0.35)",
                  }}
                >
                  {/* WhatsApp SVG Icon */}
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="shrink-0"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.72rem",
                      color: "#86efac",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontWeight: 700,
                    }}
                  >
                    Instant WhatsApp Chat
                  </span>
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                    }}
                  >
                    Message Sales Desk
                  </span>
                </div>
              </div>
              <ArrowRight size={15} color="#25d366" />
            </a>

            {/* 2. Dynamic Phone */}
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
                  flexShrink: 0,
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

            {/* 3. Dynamic Email */}
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
                  flexShrink: 0,
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

            {/* 4. Response SLA */}
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
                  flexShrink: 0,
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
                  marginBottom: "1.75rem",
                }}
              >
                Thank you for reaching out to AFP Technologies. Our engineering
                desk is reviewing your requirement and will contact you shortly.
              </p>

              {/* Instant WhatsApp Quick Connect Option after submission */}
              <a
                href={whatsappRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  backgroundColor: "#25d366",
                  borderRadius: "8px",
                  textDecoration: "none",
                  marginBottom: "1rem",
                  boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)",
                }}
              >
                <MessageSquare size={16} /> Fast-Track on WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "0.65rem 1.25rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#94a3b8",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
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
