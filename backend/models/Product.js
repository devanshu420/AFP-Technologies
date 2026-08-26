import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    detailedDescription: { type: String, default: "" },

    BigSizeImage: {
      url: { type: String },
      fileId: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    
    mainImage: {
      url: { type: String, required: true },
      fileId: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    images: [
      {
        url: { type: String, required: true },
        fileId: { type: String, default: "" },
        alt: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],

    features: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    applications: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
    ],

    // ─── Process Flow (Right Sidebar) ───
    processFlow: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],

    // ─── Multi Capacities & Advantages ───
    capacities: [{ type: String }],
    advantages: [{ type: String }],

    // ─── Machine Specs / OEM Specs ───
    capacity: { type: String, default: "" },
    power: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    material: { type: String, default: "" },
    automationType: { type: String, default: "Automatic" },
    warranty: { type: String, default: "" },

    pdf: {
      url: { type: String, default: "" },
      fileId: { type: String, default: "" },
      name: { type: String, default: "" },
    },

    featured: { type: Boolean, default: false, index: true },
    recent: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },

    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogTitle: String,
      ogDescription: String,
      ogImage: String,
      canonicalUrl: String,
    },
  },
  { timestamps: true },
);

ProductSchema.index({
  name: "text",
  shortDescription: "text",
  description: "text",
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
