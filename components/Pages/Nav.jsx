'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="site-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#071b32', // Machina Brand Theme Dark Color
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label="AFP Technologieshina home">
          <span className="brand-mark">M</span>
          <span>
            AFP Technologies<span className="brand-dot">.</span>
          </span>
        </Link>

        <nav
          className={open ? 'main-nav is-open' : 'main-nav'}
          aria-label="Primary navigation"
        >
          <Link href="/products" onClick={() => setOpen(false)}>
            Products
          </Link>
          <Link href="/equipment" onClick={() => setOpen(false)}>
            Equipment
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            About us
          </Link>
          <Link href="/downloads-pdf" onClick={() => setOpen(false)}>
            Downloads
          </Link>
          <Link
            className="nav-cta"
            href="/contact"
            onClick={() => setOpen(false)}
          >
            Get a quote <ArrowRight size={15} />
          </Link>
        </nav>

        <button
          className="icon-button menu-button"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}