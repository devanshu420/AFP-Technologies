'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
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
              <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="shrink-0"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
              <span>WhatsApp</span>
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