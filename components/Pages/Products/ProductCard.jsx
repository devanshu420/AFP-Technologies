'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  if (product && product.active === false) {
    return null;
  }

  // Consistent ID/Slug router target
  const targetId = product.slug || product._id;
  const productUrl = `/products/${targetId}`;

  const imageUrl =
    product?.images?.[0]?.url ||
    product?.mainImage?.url ||
    product?.image ||
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=85&fm=jpg';

  const categoryName =
    product?.category?.name || product?.type || 'Industrial Machinery';

  const description =
    product?.shortDescription ||
    product?.description ||
    'High-precision industrial manufacturing equipment engineered for maximum throughput and reliability.';

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(12, 26, 44, 0.65)',
        backdropFilter: 'blur(12px)',
        border: isHovered
          ? '1px solid rgba(56, 189, 248, 0.45)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: isHovered
          ? '0 20px 35px -10px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.12)'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* 1. Clickable Image Container */}
      <Link
        href={productUrl}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          overflow: 'hidden',
          backgroundColor: '#020617',
          display: 'block',
          textDecoration: 'none',
        }}
      >
        <img
          src={imageUrl}
          alt={product?.images?.[0]?.alt || product?.name || 'Industrial machine'}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            filter: isHovered
              ? 'contrast(1.06) brightness(0.98)'
              : 'contrast(1.02) brightness(0.92)',
            transition:
              'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease',
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(3, 7, 18, 0.3) 0%, transparent 40%, rgba(3, 7, 18, 0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Category Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(3, 7, 18, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: '#38bdf8',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <Layers size={12} />
          {categoryName}
        </div>

        {/* Optional Tag */}
        {product?.tag && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '4px 9px',
              borderRadius: '6px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
            }}
          >
            {product.tag}
          </span>
        )}

        {/* Direct Link Arrow Indicator */}
        {/* <span
          aria-label={`View ${product?.name}`}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: isHovered ? '#0284c7' : 'rgba(3, 7, 18, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            boxShadow: isHovered
              ? '0 0 16px rgba(2, 132, 199, 0.5)'
              : 'none',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.25s ease',
          }}
        >
          <ArrowRight size={17} />
        </span> */}
      </Link>

      {/* 2. Content */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
            <Link
              href={productUrl}
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: isHovered ? '#38bdf8' : '#f8fafc',
                textDecoration: 'none',
                letterSpacing: '-0.015em',
                transition: 'color 0.2s ease',
                display: 'block',
              }}
            >
              {product?.name}
            </Link>
          </h3>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              lineHeight: 1.55,
              margin: '0 0 1.25rem 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        </div>

        {/* 3. Card Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 500 }}>
              Deployment Ready
            </span>
          </div>

          <Link
            href={productUrl}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: isHovered ? '#38bdf8' : '#cbd5e1',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
             <span
          aria-label={`View ${product?.name}`}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: isHovered ? '#0284c7' : 'rgba(3, 7, 18, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            boxShadow: isHovered
              ? '0 0 16px rgba(2, 132, 199, 0.5)'
              : 'none',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.25s ease',
          }}
        >
          <ArrowRight size={17} />
        </span>
          </Link>
        </div>
      </div>
    </article>
  );
}