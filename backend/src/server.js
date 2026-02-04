import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

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
});
