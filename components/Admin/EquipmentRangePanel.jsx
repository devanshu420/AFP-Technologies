"use client";

import { useEffect, useState } from "react";

import {
  Edit3,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Plus,
  Upload,
  AlertTriangle,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EquipmentRangePanel() {
  const [equipment, setEquipment] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingEquipment, setEditingEquipment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    image: null,
  });

  /*
  =========================================================
  IMAGE PREVIEW
  =========================================================
  */

  const [imagePreview, setImagePreview] = useState(null);

  /*
  =========================================================
  FETCH ADMIN EQUIPMENT
  =========================================================
  */

  const fetchEquipment = async () => {
    try {
      setLoading(true);

      const token = sessionStorage.getItem("admin_jwt_token");

      const response = await fetch(
        `${API_BASE_URL}/equipment-range/admin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          cache: "no-store",
        }
      );

      const json = await response.json();

      if (!response.ok || !json?.success) {
        throw new Error(
          json?.message || "Failed to fetch equipment"
        );
      }

      /*
        Backend normally returns:

        {
          success: true,
          data: [...]
        }
      */

      setEquipment(
        Array.isArray(json.data)
          ? json.data
          : []
      );
    } catch (error) {
      console.error(
        "Equipment range fetch error:",
        error
      );

      setEquipment([]);

      alert(
        error.message ||
          "Failed to load Equipment Range."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =========================================================
  INITIAL FETCH
  =========================================================
  */

  useEffect(() => {
    fetchEquipment();
  }, []);

  /*
  =========================================================
  IMAGE HELPER
  =========================================================
  */

  const getImage = (item) => {
    return (
      item?.image?.url ||
      item?.mainImage?.url ||
      item?.images?.[0]?.url ||
      item?.image ||
      null
    );
  };

  /*
  =========================================================
  RESET FORM
  =========================================================
  */

  const resetForm = () => {
    setFormData({
      name: "",
      shortDescription: "",
      description: "",
      image: null,
    });

    setImagePreview(null);
  };

  /*
  =========================================================
  OPEN ADD
  =========================================================
  */

  const openAddModal = () => {
    resetForm();

    setEditingEquipment(null);
    setShowAddModal(true);
  };

  /*
  =========================================================
  CLOSE ADD / EDIT
  =========================================================
  */

  const closeFormModal = () => {
    if (saving) return;

    setShowAddModal(false);
    setEditingEquipment(null);

    resetForm();
  };

  /*
  =========================================================
  OPEN EDIT
  =========================================================
  */

  const openEditModal = (item) => {
    setEditingEquipment(item);

    setShowAddModal(true);

    setFormData({
      name: item.name || "",
      shortDescription:
        item.shortDescription || "",
      description: item.description || "",
      image: null,
    });

    setImagePreview(getImage(item));
  };

  /*
  =========================================================
  IMAGE CHANGE
  =========================================================
  */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    /*
      Basic validation
    */

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  /*
  =========================================================
  SAVE / CREATE
  =========================================================
  */

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Equipment name is required.");
      return;
    }

    try {
      setSaving(true);

      const token =
        sessionStorage.getItem(
          "admin_jwt_token"
        );

      /*
      =====================================================
      FORM DATA
      =====================================================
      */

      const body = new FormData();

      body.append(
        "name",
        formData.name.trim()
      );

      body.append(
        "shortDescription",
        formData.shortDescription || ""
      );

      body.append(
        "description",
        formData.description || ""
      );

      /*
        Image only when selected.
      */

      if (formData.image) {
        body.append(
          "image",
          formData.image
        );
      }

      /*
      =====================================================
      CREATE
      =====================================================
      */

      if (!editingEquipment) {
        const response = await fetch(
          `${API_BASE_URL}/equipment-range`,
          {
            method: "POST",

            headers: {
              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },

            body,
          }
        );

        const json =
          await response.json();

        if (
          !response.ok ||
          !json?.success
        ) {
          throw new Error(
            json?.message ||
              "Failed to create equipment"
          );
        }

        /*
          Add newly created equipment
          directly to UI.
        */

        if (json.data) {
          setEquipment((prev) => [
            json.data,
            ...prev,
          ]);
        } else {
          await fetchEquipment();
        }

        closeFormModal();

        return;
      }

      /*
      =====================================================
      UPDATE
      =====================================================
      */

      const response = await fetch(
        `${API_BASE_URL}/equipment-range/${editingEquipment._id}`,
        {
          method: "PUT",

          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          body,
        }
      );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json?.success
      ) {
        throw new Error(
          json?.message ||
            "Failed to update equipment"
        );
      }

      if (json.data) {
        setEquipment((prev) =>
          prev.map((item) =>
            item._id ===
            editingEquipment._id
              ? json.data
              : item
          )
        );
      } else {
        await fetchEquipment();
      }

      closeFormModal();
    } catch (error) {
      console.error(
        "Save equipment error:",
        error
      );

      alert(
        error.message ||
          "Failed to save equipment."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  =========================================================
  OPEN DELETE MODAL
  =========================================================
  */

  const openDeleteModal = (item) => {
    setDeleteTarget(item);
  };

  /*
  =========================================================
  CLOSE DELETE MODAL
  =========================================================
  */

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteTarget(null);
  };

  /*
  =========================================================
  DELETE EQUIPMENT RANGE ITEM
  =========================================================

  IMPORTANT:

  Ye Product delete nahi karega.

  Ye sirf EquipmentRange collection ka
  record delete karega.
  */

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      const token =
        sessionStorage.getItem(
          "admin_jwt_token"
        );

      const response = await fetch(
        `${API_BASE_URL}/equipment-range/${deleteTarget._id}`,
        {
          method: "DELETE",

          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json?.success
      ) {
        throw new Error(
          json?.message ||
            "Failed to delete equipment"
        );
      }

      /*
        Remove only from local
        Equipment Range UI.
      */

      setEquipment((prev) =>
        prev.filter(
          (item) =>
            item._id !==
            deleteTarget._id
        )
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error(
        "Delete equipment error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete equipment."
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
  =========================================================
  LOADING
  =========================================================
  */

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2
            size={18}
            className="animate-spin text-sky-600"
          />

          Loading equipment range...
        </div>
      </div>
    );
  }

  /*
  =========================================================
  UI
  =========================================================
  */

  return (
    <div className="space-y-5">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">

        <div className="flex items-center justify-between gap-4">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Equipment Range
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Manage equipment displayed on
              the public Equipment Range page.
            </p>
          </div>

          <div className="flex items-center gap-2">

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchEquipment}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>

            {/* ADD */}

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
            >
              <Plus size={15} />

              Add Equipment
            </button>

          </div>

        </div>

        <div className="mt-4 flex items-center gap-2">

          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold">
            {equipment.length}
          </span>

          <span className="text-xs font-medium text-slate-500">
            equipment in range
          </span>

        </div>

      </div>


      {/* =====================================================
          EMPTY
      ===================================================== */}

      {equipment.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-14 text-center">

          <ImageIcon
            size={32}
            className="mx-auto text-slate-300 mb-3"
          />

          <p className="text-sm font-semibold text-slate-700">
            No equipment found
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Add your first equipment to the
            Equipment Range.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
          >
            <Plus size={14} />
            Add Equipment
          </button>

        </div>
      )}


      {/* =====================================================
          EQUIPMENT GRID
      ===================================================== */}

 {equipment.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {equipment.map((item) => {
      const image = getImage(item);

      return (
        <div
          key={item._id}
          className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* IMAGE */}

          <div className="relative h-32 bg-slate-100 overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={item.name || "Equipment"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon
                  size={24}
                  className="text-slate-300"
                />
              </div>
            )}

            {/* IMAGE OVERLAY */}

            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />

            {/* STATUS */}

            <div className="absolute top-2.5 right-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-md text-[9px] font-bold border ${
                  item.active !== false
                    ? "bg-emerald-50/95 text-emerald-700 border-emerald-100"
                    : "bg-slate-900/75 text-white border-white/10"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.active !== false
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                  }`}
                />

                {item.active !== false
                  ? "VISIBLE"
                  : "HIDDEN"}
              </span>
            </div>
          </div>


          {/* CONTENT */}

          <div className="p-3.5">

            {/* TITLE */}

            <h3 className="text-sm font-bold text-slate-900 truncate">
              {item.name}
            </h3>

            {/* CATEGORY */}

            {item.category?.name && (
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-sky-600">
                {item.category.name}
              </p>
            )}

            {/* DESCRIPTION */}

            <p className="mt-2 text-[11px] text-slate-500 leading-4 line-clamp-2 min-h-[32px]">
              {item.description ||
                item.shortDescription ||
                "No description available."}
            </p>


            {/* DIVIDER */}

            <div className="my-3 h-px bg-slate-100" />


            {/* ACTIONS */}

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => openEditModal(item)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-[11px] font-semibold transition-colors"
              >
                <Edit3 size={12} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => openDeleteModal(item)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-900 text-white hover:bg-slate-800 text-[11px] font-semibold transition-colors"
              >
                <Trash2 size={12} />
                Delete
              </button>

            </div>

          </div>
        </div>
      );
    })}
  </div>
)}
      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}

            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h3 className="text-base font-bold text-slate-900">

                  {editingEquipment
                    ? "Edit Equipment"
                    : "Add Equipment"}

                </h3>

                <p className="text-[11px] text-slate-500 mt-0.5">

                  {editingEquipment
                    ? "Update equipment information."
                    : "Add new equipment to Equipment Range."}

                </p>

              </div>

              <button
                type="button"
                onClick={closeFormModal}
                disabled={saving}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={18} />
              </button>

            </div>


            {/* BODY */}

            <div className="p-5 space-y-4">

              {/* NAME */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Equipment Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter equipment name"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
                />

              </div>


              {/* IMAGE */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Equipment Image
                </label>

                <div className="flex items-start gap-4">

                  {/* PREVIEW */}

                  <div className="w-28 h-24 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">

                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon
                          size={24}
                          className="text-slate-300"
                        />
                      </div>
                    )}

                  </div>


                  {/* UPLOAD */}

                  <label className="flex-1">

                    <div className="border border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors">

                      <div className="flex items-center gap-2 text-slate-600">

                        <Upload size={16} />

                        <span className="text-xs font-semibold">
                          {editingEquipment
                            ? "Choose new image"
                            : "Upload image"}
                        </span>

                      </div>

                      <p className="text-[10px] text-slate-400 mt-1">
                        PNG, JPG, WEBP • Max 10MB
                      </p>

                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>

                </div>

              </div>


              {/* SHORT DESCRIPTION */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Short Description
                </label>

                <textarea
                  rows={3}
                  value={
                    formData.shortDescription
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortDescription:
                        e.target.value,
                    }))
                  }
                  placeholder="Short equipment description"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
                />

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>

                <textarea
                  rows={6}
                  value={
                    formData.description
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description:
                        e.target.value,
                    }))
                  }
                  placeholder="Detailed equipment description"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
                />

              </div>

            </div>


            {/* FOOTER */}

            <div className="px-5 py-4 border-t border-slate-200 flex justify-end gap-2">

              <button
                type="button"
                onClick={closeFormModal}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />

                    {editingEquipment
                      ? "Save Changes"
                      : "Add Equipment"}
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[120] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}

            <div className="px-5 py-4 border-b border-slate-200 flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle
                  size={19}
                  className="text-rose-600"
                />
              </div>

              <div className="flex-1">

                <h3 className="text-base font-bold text-slate-900">
                  Delete Equipment?
                </h3>

                <p className="text-xs text-slate-500 mt-1 leading-5">
                  This will permanently remove this
                  Equipment Range item.
                </p>

              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={17} />
              </button>

            </div>


            {/* BODY */}

            <div className="p-5">

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">

                <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">

                  {getImage(deleteTarget) ? (
                    <img
                      src={getImage(
                        deleteTarget
                      )}
                      alt={
                        deleteTarget.name ||
                        "Equipment"
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon
                        size={20}
                        className="text-slate-300"
                      />
                    </div>
                  )}

                </div>

                <div className="min-w-0">

                  <p className="text-sm font-bold text-slate-900 truncate">
                    {deleteTarget.name}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Equipment Range
                  </p>

                </div>

              </div>


              <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200">

                <p className="text-xs text-rose-800 leading-5">

                  <strong>Warning:</strong>{" "}
                  This deletes only the Equipment
                  Range entry. It does{" "}
                  <strong>not</strong> delete
                  anything from the Products
                  collection.

                </p>

              </div>

            </div>


            {/* FOOTER */}

            <div className="px-5 py-4 border-t border-slate-200 flex justify-end gap-2">

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-60"
              >

                {deleting ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />

                    Delete Equipment
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}