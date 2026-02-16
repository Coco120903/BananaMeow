import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend directory (before importing app/db)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = process.env.PORT || 5000;

// Connect to MongoDB and start server only after successful connection
async function startServer() {
  try {
    await connectDatabase();
    console.log("MongoDB connected successfully");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📡 API available at http://localhost:${port}`);
      console.log(`💳 Stripe key loaded: ${Boolean(process.env.STRIPE_SECRET_KEY)}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed (server will not start):", error.message);
    console.error("Please verify MONGO_URI in backend/.env and ensure the database is reachable.");
    process.exit(1);
  }
}

startServer();
