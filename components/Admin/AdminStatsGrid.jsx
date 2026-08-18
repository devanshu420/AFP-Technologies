'use client';

import { Package, Users, FileText, ShieldCheck } from 'lucide-react';

export default function AdminStatsGrid({ stats }) {
  const statItems = [
    {
      label: 'Total Products',
      value: stats?.products ?? 0,
      subValue: 'In catalog',
      icon: Package,
      iconColor: 'text-sky-600',
      bgLight: 'bg-sky-50',
    },
    {
      label: 'Total Inquiries',
      value: stats?.totalEnquiries ?? 0,
      subValue: `${stats?.newEnquiries ?? 0} Unread leads`,
      highlightSub: (stats?.newEnquiries ?? 0) > 0,
      icon: Users,
      iconColor: 'text-amber-600',
      bgLight: 'bg-amber-50',
    },
    {
      label: 'Total PDFs',
      value: stats?.totalPdfs ?? 0,
      subValue: 'Datasheets',
      icon: FileText,
      iconColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
    },
    {
      label: '',
      value: 'Admin',
      subValue: '',
      icon: ShieldCheck,
      iconColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs flex items-center gap-3"
          >
            <div className={`p-2.5 rounded-lg ${item.bgLight} ${item.iconColor} shrink-0`}>
              <Icon size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-slate-500 truncate" title={item.label}>
                {item.label}
              </span>
              <strong className="block text-lg sm:text-xl font-bold text-slate-900 leading-tight truncate">
                {item.value}
              </strong>
              <span
                className={`block text-[10px] font-medium mt-0.5 truncate ${
                  item.highlightSub
                    ? 'text-amber-600 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {item.subValue}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}