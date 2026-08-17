import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#030a16',
        color: '#f8fafc',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          textAlign: 'center',
          backgroundColor: '#071526',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <AlertTriangle
          size={48}
          color="#38bdf8"
          style={{ margin: '0 auto 1.25rem' }}
        />
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
          }}
        >
          Product Not Found
        </h1>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
          }}
        >
          The machinery specification you are looking for does not exist or may have been updated.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            href="/#products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> View All Equipment
          </Link>
        </div>
      </div>
    </div>
  );
}