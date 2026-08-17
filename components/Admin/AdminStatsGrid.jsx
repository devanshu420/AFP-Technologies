'use client';

import { Package, ShieldCheck, Users } from 'lucide-react';

export default function AdminStatsGrid({ stats }) {
  const statItems = [
    ['Catalogue Systems', stats?.products ?? 0, Package],
    ['New Enquiries', stats?.newEnquiries ?? 0, Users],
    ['Active Database', 'Connected', ShieldCheck],
  ];

  return (
    <div
      className="stats-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', // Strict 1x3 Grid on all screens
        gap: 'clamp(6px, 1.5vw, 16px)',
        width: '100%',
      }}
    >
      {statItems.map(([label, value, Icon]) => (
        <div
          className="stat-card"
          key={label}
          style={{
            minWidth: 0,
            padding: 'clamp(8px, 2vw, 18px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              marginBottom: '4px',
            }}
          >
            <Icon className="shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <span
            style={{
              display: 'block',
              fontSize: 'clamp(9px, 1.8vw, 12px)',
              color: '#94a3b8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}
            title={label}
          >
            {label}
          </span>

          <strong
            style={{
              display: 'block',
              fontSize: 'clamp(13px, 2.8vw, 22px)',
              fontWeight: 700,
              color: '#f8fafc',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '2px',
            }}
          >
            {value}
          </strong>
        </div>
      ))}
    </div>
  );
}