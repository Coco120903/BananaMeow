import express from "express";
import cors from "cors";
import catsRoutes from "./routes/catsRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import donationsRoutes from "./routes/donationsRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Banana Meow API is purring" });
});

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
