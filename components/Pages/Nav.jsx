"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Products", href: "/products" },
    { name: "Equipment", href: "/equipment" },
    { name: "About us", href: "/about" },
    { name: "Downloads", href: "/downloads-pdf" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#071b32",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0.9rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          aria-label="AFP Technologies home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "#f8fafc",
            fontWeight: 800,
            fontSize: "1.5rem",
          }}
        >
          <span
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="/afp-logo.png"
              alt="AFP Technologies Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", // Image stretch nahi hogi
              }}
            />
          </span>
          <span>
            AFP Technologies
          </span>
        </Link>

        {/* Desktop & Mobile Navigation Links */}
        <nav
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Primary navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setOpen(false);
                  if (isActive) {
                    e.preventDefault();
                  }
                }}
                style={{
                  position: "relative",
                  paddingBottom: "4px",
                  color: isActive ? "#38bdf8" : "#cbd5e1",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                {link.name}

                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "#38bdf8",
                      borderRadius: "2px",
                    }}
                  />
                )}
              </Link>
            );
          })}

          {/* CTA Quote Button */}
          <Link
            href="/contact"
            onClick={(e) => {
              setOpen(false);
              if (pathname === "/contact") {
                e.preventDefault();
              }
            }}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background-color 0.2s ease",
            }}
          >
            Get a quote <ArrowRight size={15} />
            {pathname === "/contact" && (
              <span
                style={{
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#38bdf8",
                  borderRadius: "2px",
                }}
              />
            )}
          </Link>
        </nav>

        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
            color: "#f8fafc",
            cursor: "pointer",
            display: "none", // CSS classes ke zariye media query me show hoga
            padding: "4px",
          }}
          className="menu-toggle-btn md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Global CSS for Mobile Responsiveness Toggle */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .menu-toggle-btn {
            display: flex !important;
          }
          .main-nav {
            display: none !important;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: #071b32;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1.5rem 2rem;
            gap: 1.2rem !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .main-nav.is-open {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
