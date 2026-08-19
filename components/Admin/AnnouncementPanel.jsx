"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  Save,
  Trash2,
  Edit3,
  Plus,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import GearLoader from "../GearLoader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AnnouncementPanel() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badgeText: "SPECIAL ANNOUNCEMENT",
    linkText: "Explore Now",
    linkUrl: "/products",
    active: true,
  });

  // 🟢 Helper function to retrieve Authorization header with session storage token
  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("admin_jwt_token")
        : "";
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  async function fetchAnnouncements() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/announcements/admin/all`, {
        headers: getAuthHeaders(),
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (res.ok) {
        setAnnouncements(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      badgeText: "SPECIAL ANNOUNCEMENT",
      linkText: "Explore Now",
      linkUrl: "/products",
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad) => {
    setEditingId(ad._id || ad.id);
    setFormData({
      title: ad.title || "",
      description: ad.description || "",
      badgeText: ad.badgeText || "SPECIAL ANNOUNCEMENT",
      linkText: ad.linkText || "Explore Now",
      linkUrl: ad.linkUrl || "/products",
      active: ad.active !== undefined ? ad.active : true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    try {
      setSaving(true);
      const url = editingId
        ? `${API_BASE_URL}/announcements/admin/${editingId}`
        : `${API_BASE_URL}/announcements/admin/create`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(), // 🟢 Added auth headers here
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => null);

      if (res.ok) {
        setIsModalOpen(false);
        setSuccessMsg(
          editingId
            ? "Announcement updated successfully!"
            : "Announcement created successfully!",
        );
        fetchAnnouncements();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        alert(json?.message || "Failed to save announcement");
      }
    } catch (err) {
      alert("Error saving announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/announcements/admin/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(), // 🟢 Added auth headers here
        credentials: "include",
      });
      if (res.ok) {
        fetchAnnouncements();
      } else {
        alert("Failed to delete announcement");
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800/80 rounded-2xl p-5 sm:p-6 text-slate-100 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-5 mb-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-inner">
            <Megaphone size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Hero Section Announcements & Ads
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add, update, or remove dynamic promotional text banners.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={15} />
          <span>Add New Ad</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/80">
          <GearLoader fullScreen={false} text="Loading Announcements..." />
        </div>
      ) : announcements.length === 0 ? (
        <div className="py-14 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center space-y-2">
          <Megaphone size={24} className="text-slate-600 mb-1" />
          <p>
            No announcements created yet. Click &quot;Add New Ad&quot; above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ad) => {
            const id = ad._id || ad.id;
            return (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all gap-4 group"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-950/80 text-sky-300 px-2.5 py-0.5 rounded-md border border-sky-800/60">
                      {ad.badgeText || "ANNOUNCEMENT"}
                    </span>
                    <strong className="text-sm font-bold text-white tracking-tight truncate">
                      {ad.title}
                    </strong>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        ad.active
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                          : "bg-slate-800 text-slate-400 border border-slate-700/50"
                      }`}
                    >
                      {ad.active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                    {ad.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ad)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-colors cursor-pointer border border-slate-700/50 shadow-2xs"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    className="p-2 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 hover:text-rose-200 rounded-lg text-xs transition-colors cursor-pointer border border-rose-900/40 shadow-2xs"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl text-slate-100 scale-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">
                {editingId ? "Edit Announcement" : "Create New Announcement"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) =>
                      setFormData({ ...formData, badgeText: e.target.value })
                    }
                    placeholder="e.g. EXPO 2026"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.active ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs cursor-pointer focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  >
                    <option value="true">Active (Show)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Next-Gen High Speed CNC Series"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Promotional description..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) =>
                      setFormData({ ...formData, linkText: e.target.value })
                    }
                    placeholder="e.g. Explore Now"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target URL
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkUrl: e.target.value })
                    }
                    placeholder="e.g. /products"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
