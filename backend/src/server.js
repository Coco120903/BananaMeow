import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory (before importing app/db)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = process.env.PORT || 5000;

// Try to connect to MongoDB, but don't block server startup
connectDatabase()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.warn("MongoDB connection failed (server will still start):", error.message);
    console.warn("API endpoints may not work without database connection");
  });

// Start server regardless of MongoDB connection status
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📡 API available at http://localhost:${port}`);
  console.log(`💳 Stripe key loaded: ${Boolean(process.env.STRIPE_SECRET_KEY)}`);
});
