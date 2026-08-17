'use client';

import { Package, ShieldCheck, Users } from 'lucide-react';

export default function AdminStatsGrid({ stats }) {
  const statItems = [
    ['Catalogue Systems', stats?.products ?? 0, Package],
    ['New Enquiries', stats?.newEnquiries ?? 0, Users],
    ['Active Database', 'Connected', ShieldCheck],
  ];

  return (
    <div className="stats-grid">
      {statItems.map(([label, value, Icon]) => (
        <div className="stat-card" key={label}>
          <Icon size={19} />
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}