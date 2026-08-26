import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Route Imports
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";
import downloadRoutes from "./routes/download.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import equipmentRangeRoutes from "./routes/equipmentRange.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().catch((err) => console.error("[DB Connection Fatal Error]", err));

// Global Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://afp-technologies-six.vercel.app",
      process.env.CLIENT_URL || "http://localhost:3000",
    ],
    credentials: true,
  }),
);

// Health Check
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// API Endpoints
app.use("/api/auth/admin", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/equipment-range", equipmentRangeRoutes);

// Centralized 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error("[Unhandled Server Error]", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// 🟢 Local Development ke liye listener (Vercel par serverless handler kaam karega)
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(
      `[AFP Technologies Backend] API Server listening on port ${PORT}`,
    );
  });
}

// Export for Vercel Serverless
export default app;
