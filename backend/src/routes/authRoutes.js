import express from "express";
import cors from "cors";
import { register, verifyRegister, resendCode, login, getMe, updateProfile, protect, adminLogin, verifyToken } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import catsRoutes from "./routes/catsRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import donationsRoutes from "./routes/donationsRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";


import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Banana Meow API is purring" });
});

// Public routes
router.post("/register", register);
router.post("/verify-register", verifyRegister);
router.post("/resend-code", resendCode);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);

// Admin routes
router.post("/admin/login", adminLogin);
router.get("/admin/verify", requireAdmin, verifyToken);


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/cats", catsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payments", paymentsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

export default app;
