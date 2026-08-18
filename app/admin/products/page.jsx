"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  mainImage: { url: "", fileId: "", alt: "" },
  pdf: { url: "", fileId: "", name: "" },
  seo: { title: "", description: "", keywords: [] },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");

  const [form, setForm] = useState(emptyFormState);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ type: "", text: "" });

  // ─── Local Files State (Uploaded ONLY on Form Submit) ───
  const [localMainFile, setLocalMainFile] = useState(null);
  const [localMainPreview, setLocalMainPreview] = useState("");
  const [localGalleryFiles, setLocalGalleryFiles] = useState([]); // [{ file, preview }]
  const [localPdfFile, setLocalPdfFile] = useState(null);

  // Temporary inputs
  const [tempCapacity, setTempCapacity] = useState("");
  const [tempAdvantage, setTempAdvantage] = useState("");
  const [tempFeatureTitle, setTempFeatureTitle] = useState("");
  const [tempFeatureDesc, setTempFeatureDesc] = useState("");
  const [tempAppTitle, setTempAppTitle] = useState("");
  const [tempAppDesc, setTempAppDesc] = useState("");
  const [tempSpecKey, setTempSpecKey] = useState("");
  const [tempSpecVal, setTempSpecVal] = useState("");
  const [tempFlowTitle, setTempFlowTitle] = useState("");

  const mainFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);
  const pdfFileInputRef = useRef(null);

  async function loadData() {
    setLoadingList(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products?limit=150`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/categories`, { credentials: "include" }),
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
    loadData();
  }, []);

  function showToast(type, text) {
    setToast({ type, text });
    setTimeout(() => setToast({ type: "", text: "" }), 4000);
  }

  // 1. Local Selection Handler (No Immediate API Upload)
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

  // 2. Upload Helper (Called sequentially on Submit)
  async function uploadFileToServer(file, type = "image") {
    const formData = new FormData();
    formData.append(type === "image" ? "image" : "file", file);

    const res = await fetch(`${API_BASE_URL}/uploads/${type}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || `Failed to upload ${file.name}`);
    }
    return json.data;
  }

  // 3. Edit Existing Product
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
      mainImage: prod.mainImage || { url: "", fileId: "", alt: "" },
      pdf: prod.pdf || { url: "", fileId: "", name: "" },
      seo: {
        title: prod.seo?.title || "",
        description: prod.seo?.description || "",
        keywords: Array.isArray(prod.seo?.keywords) ? prod.seo.keywords : [],
      },
    });

    // Reset local staging
    setLocalMainFile(null);
    setLocalMainPreview("");
    setLocalGalleryFiles([]);
    setLocalPdfFile(null);
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
  }

  // 4. Save Product to MongoDB (Uploads staged files to ImageKit first)
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
    if (
      !localMainFile &&
      !form.mainImage?.url &&
      form.images.length === 0 &&
      localGalleryFiles.length === 0
    ) {
      showToast("error", "Please select a main product image.");
      return;
    }

    setSaving(true);
    try {
      let finalMainImage = { ...form.mainImage };
      let finalGalleryImages = [...form.images];
      let finalPdf = { ...form.pdf };

      // Step A: Upload staged Main Image if new file selected
      if (localMainFile) {
        const uploaded = await uploadFileToServer(localMainFile, "image");
        finalMainImage = {
          url: uploaded.url,
          fileId: uploaded.fileId || "",
          alt: form.name.trim(),
        };
      }

      // Step B: Upload staged Gallery Images
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

      // Step C: Upload staged PDF if selected
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
        images: finalGalleryImages,
        pdf: finalPdf,
      };

      const url = editingId
        ? `${API_BASE_URL}/products/${editingId}`
        : `${API_BASE_URL}/products`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
          : "Product published successfully!",
      );
      cancelEditing();
      loadData();
    } catch (err) {
      showToast("error", err.message || "Error saving product");
    } finally {
      setSaving(false);
    }
  }

  // 5. Delete Product
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this machine?"))
      return;
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
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

  // Filter list
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

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased pb-16 font-sans text-xs">
      {/* ─── TOP WORKSPACE HEADER ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-3 sm:px-6 py-2 sm:py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Back Link & Title */}
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
              <Layers
                size={14}
                className="text-sky-700 shrink-0 hidden xxs:inline"
              />
              <span className="truncate">
                <span className="hidden md:inline">Machinery </span>Product
                Workspace
              </span>
            </h1>
          </div>

          {/* Right: Actions (Cancel & Save / Publish) */}
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
              className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-green-700 hover:bg-green-800 active:scale-95  text-white rounded text-[11px] sm:text-xs font-bold shadow-xs transition-all whitespace-nowrap cursor-pointer"
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

      {/* ─── TOAST NOTIFICATION ─── */}
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

      {/* ─── MAIN 2-COLUMN DUAL WORKSPACE ─── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-4 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-start">
          {/* ══════════════════════════════════════════════════════════════
              TOP ON MOBILE (lg:right): PRODUCTS LIST - ORDER FIRST
             ══════════════════════════════════════════════════════════════ */}
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

              {/* Search & Category Filter */}
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

              {/* Scrollable Products List */}
              <div className="max-h-80 md:max-h-[calc(100vh-220px)] overflow-y-auto divide-y divide-slate-100 space-y-1 pr-0.5">
                {loadingList ? (
                  <div className="py-8 text-center text-slate-400 text-[11px]">
                    Loading machinery list...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-[11px]">
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

          {/* ══════════════════════════════════════════════════════════════
              BOTTOM ON MOBILE (lg:left): CLEAN FORM (SAME COMPACT UI)
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3 sm:space-y-4">
            <form onSubmit={handleSave} className="space-y-3 sm:space-y-4">
              {/* 1. BASIC MACHINE DETAILS */}
              <section className="bg-white border border-slate-300 rounded p-3 sm:p-4 shadow-sm space-y-3">
                <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <h2 className="text-xs sm:text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                    1. Basic Machine Details
                  </h2>
                  {/* <span className="text-[10px] text-slate-400">Core database fields</span> */}
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

              {/* 2. MEDIA: LOCAL STAGING ONLY (UPLOADS ON SUBMIT) */}
              <section className="bg-white border border-slate-300 rounded p-4 shadow-sm space-y-3">
                <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <h2 className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                    2. Product Images & PDF Brochure
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Main Image */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="block text-[10.5px] font-semibold text-slate-700">
                        Main Product Image *
                      </span>
                      {/* Remove Main Image Button */}
                      {(localMainFile || form.mainImage?.url) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (mainFileInputRef.current)
                              mainFileInputRef.current.value = "";
                            if (typeof setLocalMainFile === "function")
                              setLocalMainFile(null);
                            if (typeof setLocalMainPreview === "function")
                              setLocalMainPreview("");
                            setForm({
                              ...form,
                              mainImage: { url: "", fileId: "" },
                            });
                          }}
                          className="inline-flex items-center gap-0.5 text-[10px] text-rose-600 hover:text-rose-800 font-semibold"
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
                          className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10.5px] font-semibold"
                        >
                          <Upload size={12} />{" "}
                          {localMainFile
                            ? "Change Local Image"
                            : form.mainImage?.url
                              ? "Change Image"
                              : "Choose Main Image"}
                        </button>
                        {localMainFile && (
                          <span className="block text-[9.5px] text-emerald-700 font-medium truncate">
                            Ready to upload: {localMainFile.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PDF Brochure */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="block text-[10.5px] font-semibold text-slate-700">
                        Technical PDF Brochure
                      </span>
                      {/* Remove PDF Button */}
                      {(localPdfFile || form.pdf?.url || form.pdf?.name) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (pdfFileInputRef.current)
                              pdfFileInputRef.current.value = "";
                            if (typeof setLocalPdfFile === "function")
                              setLocalPdfFile(null);
                            setForm({
                              ...form,
                              pdf: { url: "", name: "", fileId: "" },
                            });
                          }}
                          className="inline-flex items-center gap-0.5 text-[10px] text-rose-600 hover:text-rose-800 font-semibold"
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
                        className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-[10.5px] font-semibold"
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
                </div>

                {/* Multiple Gallery Images */}
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
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-700 hover:bg-sky-800 text-white rounded text-[10px] font-bold"
                    >
                      <Plus size={11} /> Select Gallery Images
                    </button>
                  </div>

                  {/* Gallery Previews Box */}
                  {(form.images.length > 0 || localGalleryFiles.length > 0) && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                      {/* Existing Uploaded Images */}
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
                            className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}

                      {/* Staged New Local Images */}
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
                                prev.filter((_, i) => i !== idx),
                              )
                            }
                            className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* 3. CAPACITIES & OEM SPECIFICATIONS */}
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

                {/* Multiple Standard Capacities */}
                <div className="pt-1">
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Multiple Standard Capacities (e.g. 100 kg/hr, 200 kg/hr, 500
                    kg/hr)
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
                      className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-bold"
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
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="text-slate-400 hover:text-rose-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. PROCESS FLOW (Right Sidebar Pipeline) */}
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
                    className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-bold"
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
                              (_, i) => i !== idx,
                            ),
                          })
                        }
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. ADVANTAGES, FEATURES & APPLICATIONS */}
              <section className="bg-white border border-slate-300 rounded p-4 shadow-sm space-y-3">
                <div className="border-b border-slate-200 pb-1.5">
                  <h2 className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                    5. Advantages, Key Features & Applications
                  </h2>
                </div>

                {/* Advantages */}
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Advantages
                  </label>
                  <div className="flex gap-1.5 mb-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Proven Technology with Low Oil Consumption"
                      value={tempAdvantage}
                      onChange={(e) => setTempAdvantage(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!tempAdvantage.trim()) return;
                        setForm({
                          ...form,
                          advantages: [
                            ...form.advantages,
                            tempAdvantage.trim(),
                          ],
                        });
                        setTempAdvantage("");
                      }}
                      className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1">
                    {form.advantages.map((adv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] text-slate-700 bg-slate-50 p-1 rounded border border-slate-200"
                      >
                        <span>» {adv}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              advantages: form.advantages.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="text-slate-400 hover:text-rose-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Features (Title + Description)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-1.5">
                    <input
                      type="text"
                      placeholder="Title (e.g. Single Operation Peeling)"
                      value={tempFeatureTitle}
                      onChange={(e) => setTempFeatureTitle(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Description (Optional)"
                        value={tempFeatureDesc}
                        onChange={(e) => setTempFeatureDesc(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!tempFeatureTitle.trim()) return;
                          setForm({
                            ...form,
                            features: [
                              ...form.features,
                              {
                                title: tempFeatureTitle.trim(),
                                description: tempFeatureDesc.trim(),
                              },
                            ],
                          });
                          setTempFeatureTitle("");
                          setTempFeatureDesc("");
                        }}
                        className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {form.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-start text-[11px]"
                      >
                        <div>
                          <strong className="text-slate-900 block">
                            {typeof feat === "string" ? feat : feat.title}
                          </strong>
                          {feat.description && (
                            <p className="text-[10px] text-slate-500">
                              {feat.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              features: form.features.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applications */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                    Applications (e.g. Potato Chips, Cassava, Sweet Potato)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-1.5">
                    <input
                      type="text"
                      placeholder="Application Name"
                      value={tempAppTitle}
                      onChange={(e) => setTempAppTitle(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Details (Optional)"
                        value={tempAppDesc}
                        onChange={(e) => setTempAppDesc(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!tempAppTitle.trim()) return;
                          setForm({
                            ...form,
                            applications: [
                              ...form.applications,
                              {
                                title: tempAppTitle.trim(),
                                description: tempAppDesc.trim(),
                              },
                            ],
                          });
                          setTempAppTitle("");
                          setTempAppDesc("");
                        }}
                        className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {form.applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-start text-[11px]"
                      >
                        <div>
                          <strong className="text-slate-900 block">
                            {typeof app === "string" ? app : app.title}
                          </strong>
                          {app.description && (
                            <p className="text-[10px] text-slate-500">
                              {app.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              applications: form.applications.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 6. TECHNICAL SPECIFICATIONS TABLE */}
              <section className="bg-white border border-slate-300 rounded p-4 shadow-sm space-y-3">
                <div className="border-b border-slate-200 pb-1.5">
                  <h2 className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                    6. Custom Technical Specification Table
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-1.5">
                  <input
                    type="text"
                    placeholder="Key (e.g. Oil Tank Capacity)"
                    value={tempSpecKey}
                    onChange={(e) => setTempSpecKey(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Value (e.g. 450 Litres)"
                      value={tempSpecVal}
                      onChange={(e) => setTempSpecVal(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!tempSpecKey.trim() || !tempSpecVal.trim()) return;
                        setForm({
                          ...form,
                          specifications: [
                            ...form.specifications,
                            {
                              key: tempSpecKey.trim(),
                              value: tempSpecVal.trim(),
                            },
                          ],
                        });
                        setTempSpecKey("");
                        setTempSpecVal("");
                      }}
                      className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-bold"
                    >
                      Add Row
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-200 bg-slate-50 rounded border border-slate-200 overflow-hidden">
                  {form.specifications.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 text-[11px]"
                    >
                      <span className="text-slate-600 font-semibold">
                        {s.key}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-medium">
                          {s.value}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              specifications: form.specifications.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
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
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-bold shadow-sm"
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
