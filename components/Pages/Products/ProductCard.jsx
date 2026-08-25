'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Layers } from 'lucide-react';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  if (product && product.active === false) {
    return null;
  }

  const targetId = product?.slug || product?._id;
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

        // Deep blue card
        background:
          'linear-gradient(145deg, #101A2B 0%, #0C1626 100%)',

        border: isHovered
          ? '1px solid rgba(59, 130, 246, 0.55)'
          : '1px solid rgba(96, 165, 250, 0.13)',

        borderRadius: '15px',
        overflow: 'hidden',

        boxShadow: isHovered
          ? '0 22px 45px rgba(2, 12, 27, 0.65), 0 0 25px rgba(37, 99, 235, 0.10)'
          : '0 10px 28px rgba(2, 12, 27, 0.45)',

        transform: isHovered
          ? 'translateY(-5px)'
          : 'translateY(0)',

        transition:
          'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* IMAGE */}
      <Link
        href={productUrl}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          background: '#070D18',
          display: 'block',
          textDecoration: 'none',
        }}
      >
        <img
          src={imageUrl}
          alt={
            product?.images?.[0]?.alt ||
            product?.name ||
            'Industrial machine'
          }
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',

            transform: isHovered
              ? 'scale(1.05)'
              : 'scale(1)',

            filter: isHovered
              ? 'brightness(0.98) contrast(1.05)'
              : 'brightness(0.88) contrast(1.03)',

            transition:
              'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
          }}
        />

        {/* Blue Dark Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(3, 12, 27, 0.08) 20%, rgba(4, 13, 28, 0.30) 55%, rgba(3, 10, 23, 0.88) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* CATEGORY */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',

            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',

            padding: '6px 10px',
            borderRadius: '7px',

            background: 'rgba(7, 18, 35, 0.88)',
            border: '1px solid rgba(96, 165, 250, 0.20)',

            backdropFilter: 'blur(8px)',

            fontSize: '0.68rem',
            fontWeight: 600,
            color: '#93C5FD',

            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <Layers size={11} />
          {categoryName}
        </div>

        {/* PRODUCT TAG */}
        {product?.tag && (
          <span
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',

              padding: '6px 10px',
              borderRadius: '6px',

              background:
                'linear-gradient(135deg, #2563EB, #1D4ED8)',

              color: '#FFFFFF',

              fontSize: '0.65rem',
              fontWeight: 700,

              letterSpacing: '0.05em',
              textTransform: 'uppercase',

              boxShadow:
                '0 5px 15px rgba(37, 99, 235, 0.30)',
            }}
          >
            {product.tag}
          </span>
        )}

        {/* VIEW BUTTON */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '14px',
            bottom: '14px',

            width: '40px',
            height: '40px',

            borderRadius: '10px',

            background: isHovered
              ? '#2563EB'
              : 'rgba(7, 18, 35, 0.88)',

            border: isHovered
              ? '1px solid rgba(147, 197, 253, 0.35)'
              : '1px solid rgba(148, 163, 184, 0.18)',

            color: '#FFFFFF',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            backdropFilter: 'blur(8px)',

            boxShadow: isHovered
              ? '0 8px 20px rgba(37, 99, 235, 0.35)'
              : 'none',

            transform: isHovered
              ? 'scale(1.05)'
              : 'scale(1)',

            transition: 'all 0.25s ease',
          }}
        >
          <ArrowUpRight size={18} strokeWidth={1.8} />
        </div>
      </Link>

      {/* CONTENT */}
      <div
        style={{
          padding: '1.3rem',

          display: 'flex',
          flexDirection: 'column',

          flex: 1,
        }}
      >
        {/* TITLE + DESCRIPTION */}
        <div>
          <h3
            style={{
              margin: '0 0 0.55rem 0',
              lineHeight: 1.3,
            }}
          >
            <Link
              href={productUrl}
              style={{
                fontSize: '1.08rem',
                fontWeight: 650,

                color: isHovered
                  ? '#60A5FA'
                  : '#F1F5F9',

                textDecoration: 'none',

                letterSpacing: '-0.01em',

                transition: 'color 0.2s ease',

                display: 'block',
              }}
            >
              {product?.name}
            </Link>
          </h3>

          <p
            style={{
              color: '#94A3B8',

              fontSize: '0.84rem',
              lineHeight: 1.6,

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

        {/* FOOTER */}
        <div
          style={{
            marginTop: 'auto',

            paddingTop: '0.9rem',

            borderTop:
              '1px solid rgba(96, 165, 250, 0.10)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* STATUS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',

                borderRadius: '50%',

                background: '#3B82F6',

                boxShadow:
                  '0 0 8px rgba(59, 130, 246, 0.65)',
              }}
            />

            <span
              style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                fontWeight: 500,
              }}
            >
              Available
            </span>
          </div>

          {/* DETAILS */}
          <Link
            href={productUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',

              color: isHovered
                ? '#60A5FA'
                : '#CBD5E1',

              fontSize: '0.8rem',
              fontWeight: 600,

              textDecoration: 'none',

              transition: 'color 0.2s ease',
            }}
          >
            <span>View Details</span>

            <ArrowUpRight
              size={14}
              style={{
                transform: isHovered
                  ? 'translate(2px, -2px)'
                  : 'translate(0, 0)',

                transition:
                  'transform 0.2s ease',
              }}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}