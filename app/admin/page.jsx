"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Inbox,
  FileText,
  PhoneCall,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  ExternalLink,
  Clock,
  RefreshCw,
  Megaphone,
  FolderTree
} from "lucide-react";
import AdminLoginForm from "../../components/Admin/AdminLoginForm";
import AdminHeading from "../../components/Admin/AdminHeading";
import AdminStatsGrid from "../../components/Admin/AdminStatsGrid";
import ProductPanel from "../../components/Admin/ProductPanel";
import EnquiryPanel from "../../components/Admin/EnquiryPanel";
import PdfPanel from "../../components/Admin/PdfPanel";
import ContactSettingsPanel from "../../components/Admin/ContactSettingsPanel";
import AnnouncementPanel from "../../components/Admin/AnnouncementPanel";
import CategoryPanel from '../../components/Admin/CategoryPanel';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [stats, setStats] = useState({
    products: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalPdfs: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentPdfs, setRecentPdfs] = useState([]);

  // Session verification
  const verifySession = useCallback(async () => {
    try {
      const storedSession = sessionStorage.getItem("admin_session_user");
      if (!storedSession) {
        setAdminUser(null);
        setSession(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/admin/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setAdminUser(json.data);
        setSession(true);
      } else {
        sessionStorage.removeItem("admin_session_user");
        setAdminUser(null);
        setSession(false);
      }
    } catch {
      sessionStorage.removeItem("admin_session_user");
      setAdminUser(null);
      setSession(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Master Initial Fetch for Dashboard
  const fetchDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [prodRes, enqRes, pdfRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/products?limit=10`, {
          credentials: "include",
          cache: "no-store",
        }),
        fetch(`${API_BASE_URL}/enquiries?limit=100`, {
          credentials: "include",
          cache: "no-store",
        }),
        fetch(`${API_BASE_URL}/downloads/admin/all`, {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      let productsCount = 0;
      let totalEnqCount = 0;
      let newEnqCount = 0;
      let pdfsCount = 0;

      if (prodRes.status === "fulfilled" && prodRes.value.ok) {
        const d = await prodRes.value.json();
        const list =
          d?.data?.products || (Array.isArray(d?.data) ? d.data : []);
        productsCount = d?.data?.pagination?.total || list.length;
        setRecentProducts(list.slice(0, 5));
      }

      if (enqRes.status === "fulfilled" && enqRes.value.ok) {
        const d = await enqRes.value.json();
        const list =
          d?.data?.enquiries || (Array.isArray(d?.data) ? d.data : []);
        totalEnqCount = list.length;
        newEnqCount = list.filter((e) => e.status === "new").length;
        setRecentEnquiries(list.slice(0, 5));
      }

      if (pdfRes.status === "fulfilled" && pdfRes.value.ok) {
        const d = await pdfRes.value.json();
        const list = Array.isArray(d?.data) ? d.data : [];
        pdfsCount = list.length;
        setRecentPdfs(list.slice(0, 5));
      }

      setStats({
        products: productsCount,
        totalEnquiries: totalEnqCount,
        newEnquiries: newEnqCount,
        totalPdfs: pdfsCount,
      });
    } catch (err) {
      console.error("Dashboard initial sync error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session, fetchDashboardData]);

  const handleProductCountChange = useCallback((count) => {
    setStats((prev) =>
      prev.products === count ? prev : { ...prev, products: count },
    );
  }, []);

  const handleEnquiryCountChange = useCallback((payload) => {
    if (typeof payload === "object" && payload !== null) {
      setStats((prev) => ({
        ...prev,
        totalEnquiries: payload.total ?? prev.totalEnquiries,
        newEnquiries: payload.unread ?? prev.newEnquiries,
      }));
    } else if (typeof payload === "number") {
      setStats((prev) => ({ ...prev, newEnquiries: payload }));
    }
  }, []);

  const handlePdfCountChange = useCallback((count) => {
    setStats((prev) =>
      prev.totalPdfs === count ? prev : { ...prev, totalPdfs: count },
    );
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/auth/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      sessionStorage.removeItem("admin_session_user");
      setSession(false);
      setAdminUser(null);
      window.location.reload();
    }
  }

  // Loading Screen
  // Loading State with Full Admin Dashboard Skeleton
  if (session === null) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row animate-pulse">
        {/* Sidebar Skeleton */}
        <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col shrink-0 p-4 space-y-4">
          <div className="h-10 bg-slate-800 rounded-lg w-3/4 mb-6" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-800/60 rounded-lg w-full" />
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navbar Skeleton */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="h-5 bg-slate-200 rounded w-32" />
            <div className="h-8 bg-slate-200 rounded-full w-24" />
          </header>

          {/* Body Skeleton */}
          <main className="flex-1 p-4 sm:p-6 space-y-6">
            {/* Heading Banner Skeleton */}
            <div className="h-20 bg-white rounded-xl border border-slate-200" />

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-white rounded-xl border border-slate-200 p-4"
                />
              ))}
            </div>

            {/* Recent Activity Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 bg-white rounded-xl border border-slate-200 p-4 space-y-3"
                >
                  <div className="h-6 bg-slate-200 rounded w-1/2 mb-4" />
                  <div className="h-12 bg-slate-100 rounded-lg w-full" />
                  <div className="h-12 bg-slate-100 rounded-lg w-full" />
                  <div className="h-12 bg-slate-100 rounded-lg w-full" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!session) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <AdminLoginForm
          onLoginSuccess={(userData) => {
            setAdminUser(userData);
            setSession(true);
          }}
        />
      </main>
    );
  }

  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: 'categories', label: 'Product Categories', icon: FolderTree },
    {
      id: "products",
      label: "Product Catalog",
      icon: Package,
      badge: stats.products,
    },
    {
      id: "enquiries",
      label: "Customer Inquiries",
      icon: Inbox,
      badge: stats.newEnquiries,
    },
    {
      id: "pdfs",
      label: "PDF Documents",
      icon: FileText,
      badge: stats.totalPdfs,
    },
    {
      id: "contact",
      label: "Contact Settings",
      icon: PhoneCall,
    },
    { id: "announcements", label: "Announcements & Ads", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Hamburger Drawer / Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:w-64 shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xs tracking-wider shadow-sm shrink-0">
              AFP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight leading-none">
                AFP Technologies
              </span>
              <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider mt-0.5">
                Workspace
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors md:hidden"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-sky-800 text-sky-100"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
          <div className="px-3 py-2 mb-2 rounded-md bg-slate-800/40">
            <span className="block text-[10px] text-slate-400">
              Signed in as
            </span>
            <p className="text-xs font-semibold text-slate-200 truncate">
              {adminUser?.email || adminUser?.name || "Admin"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 text-rose-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">
                AFP Technologies
              </span>
              <ChevronRight size={13} />
              <span className="capitalize text-sky-700 font-semibold">
                {activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchDashboardData}
              title="Refresh Dashboard Data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw
                size={15}
                className={isRefreshing ? "animate-spin text-sky-600" : ""}
              />
            </button>

            <span className="hidden sm:inline-block text-xs font-medium text-slate-600">
              Welcome,{" "}
              <strong className="text-slate-800">
                {adminUser?.name || "Admin"}
              </strong>
            </span>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <AdminHeading adminName={adminUser?.name} />

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <AdminStatsGrid stats={stats} />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={16} className="text-sky-600" />
                    Recent Activity Summary
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Top 5 recent records
                  </span>
                </div>

                {/* 3-Column Compact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {/* 1. Recent Products */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col">
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-sky-50 text-sky-600">
                          <Package size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Recent Products
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("products")}
                        className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-0.5 cursor-pointer"
                      >
                        Manage <ArrowUpRight size={13} />
                      </button>
                    </div>

                    <div className="p-3 divide-y divide-slate-100 max-h-[300px] overflow-y-auto space-y-2">
                      {recentProducts.length > 0 ? (
                        recentProducts.map((p, idx) => (
                          <div
                            key={p._id || p.id || idx}
                            className="pt-2 first:pt-0 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
                                {p.mainImage?.url ||
                                p.images?.[0]?.url ||
                                p.image ? (
                                  <img
                                    src={
                                      p.mainImage?.url ||
                                      p.images?.[0]?.url ||
                                      p.image
                                    }
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400">
                                    NA
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">
                                  {p.name || "Unnamed Product"}
                                </p>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {p.category?.name ||
                                    p.type ||
                                    "Industrial System"}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold shrink-0 ${
                                p.active !== false
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {p.active !== false ? "Active" : "Hidden"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-8">
                          No products found
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 2. Recent Inquiries */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col">
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
                          <Inbox size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Recent Inquiries
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("enquiries")}
                        className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-0.5 cursor-pointer"
                      >
                        View All <ArrowUpRight size={13} />
                      </button>
                    </div>

                    <div className="p-3 divide-y divide-slate-100 max-h-[300px] overflow-y-auto space-y-2">
                      {recentEnquiries.length > 0 ? (
                        recentEnquiries.map((enq, idx) => (
                          <div
                            key={enq._id || enq.id || idx}
                            className="pt-2 first:pt-0"
                          >
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-xs font-semibold text-slate-800 truncate">
                                {enq.name || "Anonymous"}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold uppercase ${
                                  enq.status === "new"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {enq.status || "new"}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-500 line-clamp-1">
                              {enq.message ||
                                enq.company ||
                                enq.email ||
                                "No message content"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-8">
                          No inquiries yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 3. Recent PDF Documents */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col md:col-span-2 xl:col-span-1">
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-rose-50 text-rose-600">
                          <FileText size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Recent PDFs
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("pdfs")}
                        className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-0.5 cursor-pointer"
                      >
                        Manage <ArrowUpRight size={13} />
                      </button>
                    </div>

                    <div className="p-3 divide-y divide-slate-100 max-h-[300px] overflow-y-auto space-y-2">
                      {recentPdfs.length > 0 ? (
                        recentPdfs.map((pdf, idx) => {
                          const pdfUrl = pdf.fileUrl || pdf.url;
                          const pdfTitle =
                            pdf.title || pdf.fileName || "Document.pdf";
                          return (
                            <div
                              key={pdf._id || pdf.id || idx}
                              className="pt-2 first:pt-0 flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <span className="text-xs font-semibold text-slate-800 truncate block">
                                  {pdfTitle}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {pdf.category || "Machinery Datasheet"} •{" "}
                                  {pdf.downloadCount || 0} downloads
                                </span>
                              </div>
                              {pdfUrl && (
                                <a
                                  href={pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded"
                                >
                                  <ExternalLink size={13} />
                                </a>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-8">
                          No PDFs attached
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="max-w-4xl mx-auto">
              <CategoryPanel />
            </div>
          )}

          {/* TAB 2: PRODUCT CATALOG */}
          {activeTab === "products" && (
            <div className="max-w-7xl mx-auto">
              <ProductPanel onProductCountChange={handleProductCountChange} />
            </div>
          )}

          

          {/* TAB 3: CUSTOMER INQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="max-w-7xl mx-auto">
              <EnquiryPanel onEnquiryCountChange={handleEnquiryCountChange} />
            </div>
          )}

          {/* TAB 4: PDF DOCUMENTS */}
          {activeTab === "pdfs" && (
            <div className="max-w-7xl mx-auto">
              <PdfPanel onPdfCountChange={handlePdfCountChange} />
            </div>
          )}

          {/* TAB 5: CONTACT SETTINGS */}
          {activeTab === "contact" && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900">
                  Website Contact Details
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Manage the sales phone numbers and email addresses displayed
                  in the website header, footer, and inquiry sections.
                </p>
                <ContactSettingsPanel />
              </div>
            </div>
          )}
          {activeTab === "announcements" && (
            <div className="max-w-4xl mx-auto">
              <AnnouncementPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
