'use client';

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

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = '919876543210'; // Aapka actual number
  const whatsappMessage = encodeURIComponent(
    'Hello AFP Technologies Industries, I would like to inquire about industrial machinery equipment.'
  );

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
          padding: '4.5rem clamp(1.5rem, 4vw, 3.5rem) 3rem clamp(1.5rem, 4vw, 3.5rem)',
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
                M
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

          {/* Column 4: Contact & Direct Connect */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={15} color="#38bdf8" />
                <a
                  href="tel:+919876543210"
                  style={{ color: '#cbd5e1', textDecoration: 'none' }}
                >
                  +91 98765 43210
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={15} color="#38bdf8" />
                <a
                  href="mailto:contact@machina.industries"
                  style={{ color: '#cbd5e1', textDecoration: 'none' }}
                >
                  contact@machina.industries
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={15} color="#38bdf8" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', lineHeight: 1.4 }}>
                  Industrial Area Phase II, Production Facility, Delhi, India
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Action Link */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
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
              WhatsApp Consultation <ArrowRight size={14} />
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
            © {currentYear} <strong style={{ color: '#94a3b8' }}>Machina Industries</strong>. All
            rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#10b981" /> Industrial Security & NDA Assured
            </span>
            <span style={{ color: '#334155' }}>|</span>
            <span style={{ color: '#94a3b8' }}>Precision. Performance. Progress.</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 