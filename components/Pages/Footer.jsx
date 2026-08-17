'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Cpu,
  Lock,
} from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Dynamic Contact Information from Admin Database
  const [contactInfo, setContactInfo] = useState({
    salesPhoneNumber: '+91 98765 43210',
    inquiryEmail: 'contact@afptechnologies.com',
  });

  // Fetch dynamic phone & email from database
  useEffect(() => {
    async function fetchContactSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/contact`, {
          cache: 'no-store',
        });
        const json = await res.json();
        if (res.ok && json.data) {
          setContactInfo({
            salesPhoneNumber:
              json.data.salesPhoneNumber || '+91 98765 43210',
            inquiryEmail:
              json.data.inquiryEmail || 'contact@afptechnologies.com',
          });
        }
      } catch (err) {
        console.error('Failed to load contact settings in footer:', err);
      }
    }

    fetchContactSettings();
  }, []);

  // ── Clean Dynamic Number for WhatsApp Redirect ──
  const rawCleanPhone = contactInfo.salesPhoneNumber.replace(/\D/g, '');
  const whatsappNumber =
    rawCleanPhone.length === 10 ? `91${rawCleanPhone}` : rawCleanPhone;

  const whatsappMessage = encodeURIComponent(
    'Hello AFP Technologies, I would like to inquire about your industrial machinery and engineering solutions.'
  );

  const whatsappRedirectUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer
      style={{
        backgroundColor: '#040b15',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#94a3b8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Ambient Glow Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.6), transparent)',
        }}
      />

      {/* Main Footer Content */}
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding:
            '4.5rem clamp(1.5rem, 4vw, 3.5rem) 3rem clamp(1.5rem, 4vw, 3.5rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            marginBottom: '3.5rem',
          }}
        >
          {/* Column 1: Brand Info & Mission */}
          <div style={{ maxWidth: '340px' }}>
            <Link
              className="brand"
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                marginBottom: '1.25rem',
              }}
            >
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
                }}
              >
                A
              </span>
              <span
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  letterSpacing: '0.04em',
                }}
              >
                AFP Technologies<span style={{ color: '#38bdf8' }}>.</span>
              </span>
            </Link>

            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.65,
                color: '#94a3b8',
                marginBottom: '1.5rem',
              }}
            >
              Engineering high-throughput industrial machinery, automated CNC
              processing units, and packaging systems for modern manufacturing
              floors.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                fontSize: '0.78rem',
                color: '#38bdf8',
                fontWeight: 600,
              }}
            >
              <Cpu size={14} /> ISO 9001:2015 CERTIFIED STANDARDS
            </div>
          </div>

          {/* Column 2: Machinery & Systems */}
          <div>
            <h4
              style={{
                color: '#f8fafc',
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Equipment
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.9rem',
              }}
            >
              {[
                { name: 'CNC Machining Units', href: '/products' },
                { name: 'Injection Moulding', href: '/products' },
                { name: 'Automated Packaging', href: '/products' },
                { name: 'Food Processing Systems', href: '/products' },
                { name: 'Custom Fabrication', href: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation & Company */}
          <div>
            <h4
              style={{
                color: '#f8fafc',
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Company
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.9rem',
              }}
            >
              {[
                { name: 'About AFP Technologies', href: '/about' },
                { name: 'Live Systems Catalogue', href: '/products' },
                { name: 'Request Commercial Quote', href: '/contact' },
                { name: 'Engineering Support', href: '/contact' },
                { name: 'Admin Portal', href: '/admin/login', icon: true },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    style={{
                      color: item.icon ? '#64748b' : '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = item.icon ? '#94a3b8' : '#38bdf8')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = item.icon ? '#64748b' : '#94a3b8')
                    }
                  >
                    {item.icon && <Lock size={12} />}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Dynamic Direct Connect */}
          <div>
            <h4
              style={{
                color: '#f8fafc',
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Sales & Factory
            </h4>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Dynamic Phone Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={15} color="#38bdf8" />
                <a
                  href={`tel:${contactInfo.salesPhoneNumber.replace(/\s+/g, '')}`}
                  style={{ color: '#cbd5e1', textDecoration: 'none' }}
                >
                  {contactInfo.salesPhoneNumber}
                </a>
              </div>

              {/* Dynamic Email Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={15} color="#38bdf8" />
                <a
                  href={`mailto:${contactInfo.inquiryEmail}`}
                  style={{ color: '#cbd5e1', textDecoration: 'none' }}
                >
                  {contactInfo.inquiryEmail}
                </a>
              </div>

              {/* Physical Location */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={15} color="#38bdf8" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', lineHeight: 1.4 }}>
                  Industrial Area Phase II, Production Facility, Delhi, India
                </span>
              </div>
            </div>

            {/* Direct Dynamic WhatsApp Action Link */}
            <a
              href={whatsappRedirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(37, 211, 102, 0.1)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                color: '#34d399',
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#25D366';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.1)';
                e.currentTarget.style.color = '#34d399';
              }}
            >
              {/* WhatsApp Icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.014.376-.101c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.926l-1.564 5.717 5.867-1.539c1.703.931 3.659 1.478 5.741 1.478 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>WhatsApp Consultation</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Operational Guarantee */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <div>
            © {currentYear} <strong style={{ color: '#94a3b8' }}>AFP Technologies</strong>. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#10b981" /> Industrial Security &amp; NDA Assured
            </span>
            <span style={{ color: '#334155' }}>|</span>
            <span style={{ color: '#94a3b8' }}>Precision. Performance. Progress.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}