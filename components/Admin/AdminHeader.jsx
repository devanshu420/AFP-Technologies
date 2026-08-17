"use client";

import { ArrowRight, LogOut } from "lucide-react";

export default function AdminHeader({ adminRole = "admin", onLogout }) {
  return (
    <header className="admin-top">
      <div>
        <a className="brand admin-brand" href="/">
          AFP Technologies<span className="brand-dot">.</span>
        </a>
        <p className="kicker dark">
          <span /> ADMIN WORKSPACE ({adminRole})
        </p>
      </div>
      <div className="admin-actions">
        <a className="button ghost" href="/">
          View site <ArrowRight size={15} />
        </a>
        <button
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          onClick={onLogout}
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </header>
  );
}
