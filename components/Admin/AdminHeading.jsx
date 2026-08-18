'use client';

export default function AdminHeading({ adminName = 'Administrator' }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
        Control Panel
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
        Welcome back, <strong className="text-sky-600 font-semibold">{adminName}</strong>
      </p>
    </div>
  );
}