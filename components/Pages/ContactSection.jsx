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

  // ── Clean dynamic number for WhatsApp Redirect ──
  // Removes all +, spaces, dashes, brackets etc.
  const rawCleanPhone = contactInfo.salesPhoneNumber.replace(/\D/g, "");
  // Default country code 91 if user only provided 10 digits
  const whatsappNumber = rawCleanPhone.length === 10 ? `91${rawCleanPhone}` : rawCleanPhone;

  // Custom pre-filled message for WhatsApp
  const whatsappCustomMessage = encodeURIComponent(
    requestedProduct
      ? `Hello AFP Technologies, I want to inquire about: ${requestedProduct}.`
      : `Hello AFP Technologies, I would like to consult about your industrial machinery solutions.`
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
                e.currentTarget.style.backgroundColor = "rgba(37, 211, 102, 0.16)";
                e.currentTarget.style.borderColor = "#25d366";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(37, 211, 102, 0.08)";
                e.currentTarget.style.borderColor = "rgba(37, 211, 102, 0.35)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.014.376-.101c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.926l-1.564 5.717 5.867-1.539c1.703.931 3.659 1.478 5.741 1.478 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
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
                  <span style={{ color: "#ffffff", fontSize: "0.88rem", fontWeight: 600 }}>
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
                Thank you for reaching out to AFP Technologies. Our engineering desk
                is reviewing your requirement and will contact you shortly.
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