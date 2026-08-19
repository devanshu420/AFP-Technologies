"use client";

import { useState, useEffect } from "react";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import GearLoader from "../GearLoader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function CategoryPanel() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Custom Delete Modal & Error States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Helper function to get auth headers from session storage
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

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      const json = await res.json();
      if (res.ok) {
        const list = Array.isArray(json?.data) ? json.data : [];
        setCategories(list);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    try {
      setSaving(true);
      const catId = editingCategory?._id || editingCategory?.id;
      const url = editingCategory
        ? `${API_BASE_URL}/categories/${catId}`
        : `${API_BASE_URL}/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setSuccessMsg(
          editingCategory
            ? "Category updated successfully!"
            : "Category created successfully!",
        );
        loadCategories();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        const json = await res.json().catch(() => null);
        alert(json?.message || "Failed to save category");
      }
    } catch (err) {
      alert("Error saving category");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteError("");
    setDeleteModalOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (!categoryToDelete) return;
    const id = categoryToDelete._id || categoryToDelete.id;
    setDeleteError("");

    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const json = await res.json().catch(() => null);

      if (res.ok) {
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        setSuccessMsg("Category deleted successfully!");
        loadCategories();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        // UI Friendly Warning Message as requested
        setDeleteError(
          json?.message?.includes("referenced")
            ? "You cannot delete this category until you delete its associated products."
            : json?.message || "Failed to delete category.",
        );
      }
    } catch (err) {
      setDeleteError("Error connecting to backend server.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-xl text-slate-100 flex flex-col justify-between transition-all">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3.5 mb-4 gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <FolderTree className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                Product Categories
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-indigo-400">
                {categories.length} Total
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 mt-0.5 truncate">
              Manage machinery categories for product catalog filtering
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus size={14} /> <span>Add Category</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/80">
            <GearLoader fullScreen={false} text="Loading categories..." />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/80 px-4">
            <FolderTree
              size={26}
              className="mx-auto mb-2 text-slate-600 opacity-60"
            />
            <p className="font-semibold text-slate-400">No categories found</p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Click &quot;Add Category&quot; above to create one.
            </p>
          </div>
        ) : (
          categories.map((cat) => {
            const id = cat._id || cat.id;
            return (
              <div
                key={id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/30 hover:border-slate-700/80 transition-all gap-3"
              >
                <div className="min-w-0 flex-1">
                  <h4
                    className="text-xs sm:text-sm font-bold text-white truncate"
                    title={cat.name}
                  >
                    {cat.name}
                  </h4>
                  {cat.description && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(cat)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? "Edit Product Category" : "Add New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Injection Moulding"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional brief description..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Category</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal with Friendly UI Warning */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 sm:p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Confirm Deletion
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Are you sure you want to delete{" "}
              <strong className="text-white">
                &quot;{categoryToDelete?.name}&quot;
              </strong>
              ?
            </p>

            {deleteError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium text-left leading-relaxed">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteExecute}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/40 transition-colors cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
