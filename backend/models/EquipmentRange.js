import mongoose from "mongoose";

const EquipmentRangeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      url: {
        type: String,
        required: true,
      },

      fileId: {
        type: String,
        default: "",
      },

      alt: {
        type: String,
        default: "",
      },
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EquipmentRange ||
  mongoose.model("EquipmentRange", EquipmentRangeSchema);