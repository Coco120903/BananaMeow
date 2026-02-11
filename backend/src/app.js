import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import catsRoutes from "./routes/catsRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import donationsRoutes from "./routes/donationsRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Banana Meow API is purring" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/cats", catsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payments", paymentsRoutes);

// 404 handler — return JSON, not HTML
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

export default app;
