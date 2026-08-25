"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  Pencil,
  X,
  Search,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Package,
} from "lucide-react";
import GearLoader from "../../../components/GearLoader";

const emptyFormState = {
  name: "",
  slug: "",
  category: "",
  shortDescription: "",
  description: "",
  detailedDescription: "",
  capacity: "",
  power: "",
  dimensions: "",
  material: "",
  automationType: "Automatic",
  warranty: "1-Year Comprehensive OEM Guarantee",
  featured: false,
  active: true,
  capacities: [],
  advantages: [],
  features: [],
  applications: [],
  specifications: [],
  processFlow: [],
  images: [],
  BigSizeImage: { url: "", fileId: "", alt: "" },
  mainImage: { url: "", fileId: "", alt: "" },
  pdf: { url: "", fileId: "", name: "" },
  seo: { title: "", description: "", keywords: [] },
};

export default function AdminProductsPage() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");

  const [form, setForm] = useState(emptyFormState);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ type: "", text: "" });

  // Local Files State
  const [localMainFile, setLocalMainFile] = useState(null);
  const [localMainPreview, setLocalMainPreview] = useState("");
  const [localGalleryFiles, setLocalGalleryFiles] = useState([]);
  const [localPdfFile, setLocalPdfFile] = useState(null);
  const [localBigImageFile, setLocalBigImageFile] = useState(null);
  const [localBigImagePreview, setLocalBigImagePreview] = useState("");

  // Temporary inputs
  const [tempCapacity, setTempCapacity] = useState("");
  const [tempAdvantage, setTempAdvantage] = useState("");
  const [tempFlowTitle, setTempFlowTitle] = useState("");

  const mainFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);
  const pdfFileInputRef = useRef(null);
  const bigImageInputRef = useRef(null);

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = sessionStorage.getItem("admin_jwt_token");

      if (!token) {
        router.push("/admin?auth=required");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/admin/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const json = await res.json();

        if (res.ok && json.success) {
          setAuthorized(true);
        } else {
          sessionStorage.removeItem("admin_jwt_token");
          sessionStorage.removeItem("admin_session_user");
          router.push("/admin?auth=required");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin?auth=required");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, API_BASE_URL]);

  async function loadData() {
    setLoadingList(true);
    try {
      const token = sessionStorage.getItem("admin_jwt_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products?limit=150`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${API_BASE_URL}/categories`, { headers, cache: "no-store" }),
      ]);

      const [prodJson, catJson] = await Promise.all([
        prodRes.json(),
        catRes.json(),
      ]);

      const prodList = prodJson?.data?.products || [];
      const catList = catJson?.data || [];

      setProducts(prodList);
      setCategories(catList);

      if (catList.length > 0 && !form.category) {
        setForm((prev) => ({ ...prev, category: catList[0]._id }));
      }
    } catch {
      showToast("error", "Failed to load catalogue.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    if (authorized) {
      loadData();
    }
  }, [authorized]);

  function showToast(type, text) {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 4000);
  }

  function handleMainFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalMainFile(file);
    setLocalMainPreview(URL.createObjectURL(file));
  }

  function handleGalleryFilesSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      alt: file.name.split(".")[0],
    }));

    setLocalGalleryFiles((prev) => [...prev, ...previews]);
  }

  function handlePdfFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalPdfFile(file);
  }

  async function uploadFileToServer(file, type = "image") {
    const formData = new FormData();
    formData.append(type === "image" ? "image" : "file", file);
    const token = sessionStorage.getItem("admin_jwt_token");

    const res = await fetch(`${API_BASE_URL}/uploads/${type}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || `Failed to upload ${file.name}`);
    }
    return json.data;
  }

  function startEditing(prod) {
    setEditingId(prod._id);
    setForm({
      name: prod.name || "",
      slug: prod.slug || "",
      category: prod.category?._id || prod.category || categories[0]?._id || "",
      shortDescription: prod.shortDescription || "",
      description: prod.description || "",
      detailedDescription: prod.detailedDescription || "",
      capacity: prod.capacity || "",
      power: prod.power || "",
      dimensions: prod.dimensions || "",
      material: prod.material || "",
      automationType: prod.automationType || "Automatic",
      warranty: prod.warranty || "1-Year Comprehensive OEM Guarantee",
      featured: prod.featured ?? false,
      active: prod.active ?? true,
      capacities: Array.isArray(prod.capacities) ? prod.capacities : [],
      advantages: Array.isArray(prod.advantages) ? prod.advantages : [],
      features: Array.isArray(prod.features) ? prod.features : [],
      applications: Array.isArray(prod.applications) ? prod.applications : [],
      specifications: Array.isArray(prod.specifications)
        ? prod.specifications
        : [],
      processFlow: Array.isArray(prod.processFlow) ? prod.processFlow : [],
      images: Array.isArray(prod.images) ? prod.images : [],
      BigSizeImage: prod.BigSizeImage || { url: "", fileId: "", alt: "" },
      mainImage: prod.mainImage || { url: "", fileId: "", alt: "" },
      pdf: prod.pdf || { url: "", fileId: "", name: "" },
      seo: {
        title: prod.seo?.title || "",
        description: prod.seo?.description || "",
        keywords: Array.isArray(prod.seo?.keywords) ? prod.seo.keywords : [],
      },
    });

    setLocalMainFile(null);
    setLocalMainPreview("");
    setLocalGalleryFiles([]);
    setLocalPdfFile(null);
    setLocalBigImageFile(null);
    setLocalBigImagePreview("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm({
      ...emptyFormState,
      category: categories[0]?._id || "",
    });
    setLocalMainFile(null);
    setLocalMainPreview("");
    setLocalGalleryFiles([]);
    setLocalPdfFile(null);
    setLocalBigImageFile(null);
    setLocalBigImagePreview("");
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast("error", "Product name is required.");
      return;
    }
    if (!form.category) {
      showToast("error", "Please choose a category.");
      return;
    }

    setSaving(true);
    try {
      let finalMainImage = { ...form.mainImage };
      let finalBigSizeImage = { ...form.BigSizeImage };
      let finalGalleryImages = [...form.images];
      let finalPdf = { ...form.pdf };

      if (localMainFile) {
        const uploaded = await uploadFileToServer(localMainFile, "image");
        finalMainImage = {
          url: uploaded.url,
          fileId: uploaded.fileId || "",
          alt: form.name.trim(),
        };
      }

      if (localBigImageFile) {
        const uploaded = await uploadFileToServer(localBigImageFile, "image");
        finalBigSizeImage = {
          url: uploaded.url,
          fileId: uploaded.fileId || "",
          alt: form.name.trim() || "Product Full Banner",
        };
      }

      if (localGalleryFiles.length > 0) {
        for (const item of localGalleryFiles) {
          const uploaded = await uploadFileToServer(item.file, "image");
          finalGalleryImages.push({
            url: uploaded.url,
            fileId: uploaded.fileId || "",
            alt: item.alt || form.name.trim(),
            order: finalGalleryImages.length,
          });
        }
      }

      if (localPdfFile) {
        const uploaded = await uploadFileToServer(localPdfFile, "file");
        finalPdf = {
          url: uploaded.url,
          fileId: uploaded.fileId || "",
          name: localPdfFile.name,
        };
      }

      const payload = {
        ...form,
        name: form.name.trim(),
        slug:
          form.slug.trim() ||
          form.name
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-"),
        mainImage: finalMainImage.url ? finalMainImage : finalGalleryImages[0],
        BigSizeImage: finalBigSizeImage,
        images: finalGalleryImages,
        pdf: finalPdf,
      };

      const url = editingId
        ? `${API_BASE_URL}/products/${editingId}`
        : `${API_BASE_URL}/products`;

      const method = editingId ? "PUT" : "POST";
      const token = sessionStorage.getItem("admin_jwt_token");

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save product");
      }

      showToast(
        "success",
        editingId
          ? "Product updated successfully!"
          : "Product published successfully!"
      );
      cancelEditing();
      loadData();
    } catch (err) {
      showToast("error", err.message || "Error saving product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this machine?"))
      return;
    try {
      const token = sessionStorage.getItem("admin_jwt_token");
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("success", "Product deleted.");
        if (editingId === id) cancelEditing();
        loadData();
      } else {
        showToast("error", json.message || "Failed to delete.");
      }
    } catch {
      showToast("error", "Delete operation failed.");
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategoryFilter === "ALL" ||
      p.category?._id === selectedCategoryFilter ||
      p.category === selectedCategoryFilter;
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return null;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased pb-16 font-sans text-xs">
      {/* TOP WORKSPACE HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-3 sm:px-6 py-2 sm:py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-600 hover:text-sky-700 px-2 sm:px-2.5 py-1 rounded bg-slate-50 border border-slate-200 font-medium shrink-0 transition-colors"
            >
              <ArrowLeft size={13} className="shrink-0" />
              <span className="hidden xs:inline">Dashboard</span>
            </Link>

            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block shrink-0" />

            <h1 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
              <Layers size={14} className="text-sky-700 shrink-0 hidden xxs:inline" />
              <span className="truncate">
                <span className="hidden md:inline">Machinery </span>Product Workspace
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-green-700 hover:bg-green-800 active:scale-95 text-white rounded text-[11px] sm:text-xs font-bold shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              <Check size={13} className="shrink-0" />
              <span>
                {saving ? "Saving..." : editingId ? "Update" : "Done"}
              </span>
              <span className="hidden sm:inline">{!saving && " Product"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toast.text && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-3.5 py-2.5 rounded border text-xs font-semibold shadow-lg flex items-center gap-2 ${
            toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-4 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-start">
          
          {/* PRODUCTS LIST */}
          <div className="col-span-1 lg:col-span-5 xl:col-span-4 order-first lg:order-last lg:sticky lg:top-16">
            <div className="bg-white border border-slate-300 rounded p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Package size={14} className="text-sky-700 shrink-0" />
                  <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider truncate">
                    Existing Products ({filteredProducts.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={loadData}
                  className="text-slate-500 hover:text-slate-900 p-1 shrink-0"
                  title="Reload"
                >
                  <RefreshCw
                    size={12}
                    className={loadingList ? "animate-spin" : ""}
                  />
                </button>
              </div>

              <div className="space-y-1.5 mb-2.5">
                <div className="relative">
                  <Search
                    size={12}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded pl-7 pr-2 py-1.5 text-xs md:text-[11px] text-slate-900"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-xs md:text-[11px] text-slate-700"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="max-h-80 md:max-h-[calc(100vh-220px)] overflow-y-auto divide-y divide-slate-100 space-y-1 pr-0.5">
                {loadingList ? (
                  <div className="py-12 min-h-[220px] flex items-center justify-center text-slate-400 text-[11px]">
                    Loading machinery list...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-12 min-h-[220px] flex items-center justify-center text-center text-slate-400 text-[11px]">
                    No matching machinery found.
                  </div>
                ) : (
                  filteredProducts.map((p) => {
                    const isCurrent = editingId === p._id;
                    return (
                      <div
                        key={p._id}
                        className={`p-2 rounded border transition-all ${
                          isCurrent
                            ? "bg-sky-50 border-sky-600 shadow-sm"
                            : "bg-slate-50/50 border-slate-200 hover:bg-slate-100/70"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <img
                            src={
                              p.mainImage?.url ||
                              p.images?.[0]?.url ||
                              "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=120&q=80"
                            }
                            alt=""
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded border border-slate-200 bg-white object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <strong className="text-slate-900 block truncate text-[10px] sm:text-[11px]">
                                {p.name}
                              </strong>
                              <span
                                className={`text-[8px] sm:text-[8.5px] font-bold px-1 py-0.5 rounded shrink-0 ${
                                  p.active
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {p.active ? "ACTIVE" : "OFF"}
                              </span>
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate">
                              {p.category?.name || "Uncategorized"} • {p.slug}
                            </span>
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => startEditing(p)}
                                className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-sky-700 hover:text-sky-900 px-1.5 py-0.5 bg-white rounded border border-slate-300 shadow-sm hover:shadow"
                              >
                                <Pencil size={10} /> Edit
                              </button>
                              <Link
                                href={`/products/${p.slug || p._id}`}
                                target="_blank"
                                className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] text-slate-500 hover:text-slate-900 px-1 py-0.5"
                              >
                                <ExternalLink size={10} /> View
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDelete(p._id)}
                                className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] text-rose-600 hover:text-rose-800 ml-auto"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* PRODUCT FORM */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3 sm:space-y-4">
            <form onSubmit={handleSave} className="space-y-3 sm:space-y-4">
              
              {/* 1. BASIC MACHINE DETAILS */}
              <section className="bg-white border border-slate-300 rounded p-3 sm:p-4 shadow-sm space-y-3">
                <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <h2 className="text-xs sm:text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                    1. Basic Machine Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-[10px] sm:text-[10.5px] font-semibold text-slate-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Potato Chips Line"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[10.5px] font-semibold text-slate-700 mb-1">
                      Slug (URL Key)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. potato-chips-line"
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[10.5px] font-semibold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 pt-1 sm:pt-3">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) =>
                          setForm({ ...form, active: e.target.checked })
                        }
                        className="w-3.5 h-3.5 accent-sky-700 rounded"
                      />
                      <span className="text-[10px] sm:text-[11px] text-slate-700 font-medium">
                        Active (Public)
                      </span>
                    </label>

                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) =>
                          setForm({ ...form, featured: e.target.checked })
                        }
                        className="w-3.5 h-3.5 accent-amber-600 rounded"
                      />
                      <span className="text-[10px] sm:text-[11px] text-slate-700 font-medium">
                        Featured Machine
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[10.5px] font-semibold text-slate-700 mb-1">
                    Short Summary Description
                  </label>
                  <input
                    type="text"
                    placeholder="Brief 1-2 line overview for cards"
                    value={form.shortDescription}
                    onChange={(e) =>
                      setForm({ ...form, shortDescription: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[10.5px] font-semibold text-slate-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Detailed explanation of machine and engineering capabilities..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                  />
                </div>
              </section>

              {/* 2. MEDIA (Includes Main Image, BigSizeImage Banner, PDF, Gallery) */}
              <section className="bg-white border border-slate-300 rounded p-4 shadow-sm space-y-3">
                <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <h2 className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                    2. Product Images, PDF & Full-Size Banner
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Main Image */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="block text-[10.5px] font-semibold text-slate-700">
                        Main Product Image *
                      </span>
                      {(localMainFile || form.mainImage?.url) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (mainFileInputRef.current)
                              mainFileInputRef.current.value = "";
                            setLocalMainFile(null);
                            setLocalMainPreview("");
                            setForm({
                              ...form,
                              mainImage: { url: "", fileId: "" },
                            });
                          }}
                          className="inline-flex items-center gap-0.5 text-[10px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        >
                          <X size={11} /> Remove
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="relative w-14 h-14 rounded border border-slate-300 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        {localMainPreview || form.mainImage?.url ? (
                          <img
                            src={localMainPreview || form.mainImage.url}
                            alt="Main Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] text-slate-400">
                            No Image
                          </span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <input
                          type="file"
                          accept="image/*"
                          ref={mainFileInputRef}
                          onChange={handleMainFileSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => mainFileInputRef.current?.click()}
                          className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10.5px] font-semibold cursor-pointer"
                        >
                          <Upload size={12} />{" "}
                          {localMainFile
                            ? "Change Local Image"
                            : form.mainImage?.url
                            ? "Change Image"
                            : "Choose Main Image"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PDF Brochure */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="block text-[10.5px] font-semibold text-slate-700">
                        Technical PDF Brochure
                      </span>
                      {(localPdfFile || form.pdf?.url || form.pdf?.name) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (pdfFileInputRef.current)
                              pdfFileInputRef.current.value = "";
                            setLocalPdfFile(null);
                            setForm({
                              ...form,
                              pdf: { url: "", name: "", fileId: "" },
                            });
                          }}
                          className="inline-flex items-center gap-0.5 text-[10px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        >
                          <X size={11} /> Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      accept=".pdf"
                      ref={pdfFileInputRef}
                      onChange={handlePdfFileSelect}
                      className="hidden"
                    />
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => pdfFileInputRef.current?.click()}
                        className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10.5px] font-semibold cursor-pointer"
                      >
                        <FileText size={12} />{" "}
                        {localPdfFile
                          ? "Change PDF"
                          : form.pdf?.url
                          ? "Replace PDF"
                          : "Select PDF"}
                      </button>
                      <span className="block text-[10px] text-slate-600 truncate">
                        {localPdfFile
                          ? `Staged: ${localPdfFile.name}`
                          : form.pdf?.name || "No PDF attached"}
                      </span>
                    </div>
                  </div>

                  {/* ─── BIG SIZE IMAGE (FULL WIDTH BANNER) WITH REMOVE BUTTON ─── */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5 sm:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="block text-[10.5px] font-semibold text-slate-700">
                        Big Size Image (Full-Width Description Banner)
                      </span>
                      
                      {(localBigImageFile || form.BigSizeImage?.url) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (bigImageInputRef.current)
                              bigImageInputRef.current.value = "";
                            setLocalBigImageFile(null);
                            setLocalBigImagePreview("");
                            setForm({
                              ...form,
                              BigSizeImage: { url: "", fileId: "", alt: "" },
                            });
                            showToast("success", "Banner image removed.");
                          }}
                          className="inline-flex items-center gap-0.5 text-[10px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        >
                          <X size={11} /> Remove Banner
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="relative w-full sm:w-36 h-20 rounded border border-slate-300 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        {localBigImagePreview || form.BigSizeImage?.url ? (
                          <img
                            src={localBigImagePreview || form.BigSizeImage.url}
                            alt="Big Banner Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] text-slate-400">
                            No Banner Image
                          </span>
                        )}
                      </div>
                      <div className="flex-1 w-full space-y-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          ref={bigImageInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setLocalBigImageFile(file);
                            setLocalBigImagePreview(URL.createObjectURL(file));
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => bigImageInputRef.current?.click()}
                          className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10.5px] font-semibold cursor-pointer"
                        >
                          <Upload size={12} />
                          {localBigImageFile
                            ? "Change Staged Image"
                            : form.BigSizeImage?.url
                            ? "Replace Banner Image"
                            : "Choose Banner Image"}
                        </button>
                        {localBigImageFile && (
                          <span className="block text-[9.5px] text-emerald-700 font-medium truncate">
                            Staged: {localBigImageFile.name}
                          </span>
                        )}
                        <p className="text-[9.5px] text-slate-500">
                          Yeh image frontend par Product Description ke theek niche full width banner me show hogi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10.5px] font-semibold text-slate-700">
                      Product Gallery (
                      {form.images.length + localGalleryFiles.length} Images)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={galleryFileInputRef}
                      onChange={handleGalleryFilesSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-700 hover:bg-sky-800 text-white rounded text-[10px] font-bold cursor-pointer"
                    >
                      <Plus size={11} /> Select Gallery Images
                    </button>
                  </div>

                  {(form.images.length > 0 || localGalleryFiles.length > 0) && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                      {form.images.map((img, idx) => (
                        <div
                          key={`existing-${idx}`}
                          className="relative group rounded border border-slate-300 overflow-hidden aspect-video bg-white"
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                images: form.images.filter((_, i) => i !== idx),
                              })
                            }
                            className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}

                      {localGalleryFiles.map((item, idx) => (
                        <div
                          key={`staged-${idx}`}
                          className="relative group rounded border-2 border-dashed border-sky-600 overflow-hidden aspect-video bg-white"
                        >
                          <img
                            src={item.preview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-sky-700 text-white text-[8px] text-center font-bold">
                            NEW
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setLocalGalleryFiles((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* 3. CAPACITIES & SPECIFICATIONS */}
              <section className="bg-white border border-slate-300 rounded p-4 shadow-sm space-y-3">
                <div className="border-b border-slate-200 pb-1.5">
                  <h2 className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                    3. Specifications & Standard Capacities
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Power
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 45 kW"
                      value={form.power}
                      onChange={(e) =>
                        setForm({ ...form, power: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Material
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SS 304 Stainless"
                      value={form.material}
                      onChange={(e) =>
                        setForm({ ...form, material: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Automation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fully Automatic"
                      value={form.automationType}
                      onChange={(e) =>
                        setForm({ ...form, automationType: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      placeholder="L x W x H"
                      value={form.dimensions}
                      onChange={(e) =>
                        setForm({ ...form, dimensions: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Warranty
                    </label>
                    <input
                      type="text"
                      value={form.warranty}
                      onChange={(e) =>
                        setForm({ ...form, warranty: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Primary Capacity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500 kg/hr"
                      value={form.capacity}
                      onChange={(e) =>
                        setForm({ ...form, capacity: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Multiple Standard Capacities
                  </label>
                  <div className="flex gap-1.5 mb-1.5">
                    <input
                      type="text"
                      placeholder="Type capacity and click add..."
                      value={tempCapacity}
                      onChange={(e) => setTempCapacity(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!tempCapacity.trim()) return;
                        setForm({
                          ...form,
                          capacities: [...form.capacities, tempCapacity.trim()],
                        });
                        setTempCapacity("");
                      }}
                      className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {form.capacities.map((cap, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded text-[10.5px]"
                      >
                        • {cap}
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              capacities: form.capacities.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. PROCESS FLOW */}
              <section className="bg-white border border-slate-300 rounded p-4 shadow-sm space-y-3">
                <div className="border-b border-slate-200 pb-1.5">
                  <h2 className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                    4. Process Flow Steps (Right Sidebar)
                  </h2>
                </div>
                <div className="flex gap-1.5 mb-1.5">
                  <input
                    type="text"
                    placeholder="Step Title (e.g. Destoning & Washing)"
                    value={tempFlowTitle}
                    onChange={(e) => setTempFlowTitle(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!tempFlowTitle.trim()) return;
                      setForm({
                        ...form,
                        processFlow: [
                          ...form.processFlow,
                          {
                            title: tempFlowTitle.trim(),
                            description: "",
                            order: form.processFlow.length + 1,
                          },
                        ],
                      });
                      setTempFlowTitle("");
                    }}
                    className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-bold cursor-pointer"
                  >
                    Add Step
                  </button>
                </div>
                <div className="space-y-1">
                  {form.processFlow.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 text-[9px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-slate-800 font-medium">
                          {typeof step === "string" ? step : step.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            processFlow: form.processFlow.filter(
                              (_, i) => i !== idx
                            ),
                          })
                        }
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Form Bottom Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-bold shadow-sm cursor-pointer"
                >
                  <Check size={14} />{" "}
                  {saving
                    ? "Uploading & Saving..."
                    : editingId
                    ? "Update Machinery System"
                    : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}