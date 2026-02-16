import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend directory (before importing app/db)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

// Connect to MongoDB and start server only after successful connection
async function startServer() {
  try {
    await connectDatabase();
    console.log("MongoDB connected successfully");

    // Create HTTP server from Express app
    const httpServer = http.createServer(app);

    // Attach Socket.IO
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: function (origin, callback) {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Make io accessible from Express routes via req.app.get("io")
    app.set("io", io);

    // Socket.IO authentication middleware
    io.use((socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "banana-meow-secret-key-2024"
        );
        socket.userId = decoded.id;
        socket.userRole = decoded.role;
        next();
      } catch (err) {
        return next(new Error("Invalid or expired token"));
      }
    });

    // Socket.IO connection handler
    io.on("connection", (socket) => {
      console.log(`🔌 Socket connected: ${socket.id} (user: ${socket.userId || socket.userRole})`);

      // Join the authenticated_users room so we can broadcast to all logged-in users
      socket.join("authenticated_users");

      socket.on("disconnect", (reason) => {
        console.log(`🔌 Socket disconnected: ${socket.id} (${reason})`);
      });
    });

    httpServer.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📡 API available at http://localhost:${port}`);
      console.log(`🔌 Socket.IO ready`);
      console.log(`💳 Stripe key loaded: ${Boolean(process.env.STRIPE_SECRET_KEY)}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed (server will not start):", error.message);
    console.error("Please verify MONGO_URI in backend/.env and ensure the database is reachable.");
    process.exit(1);
  }
}

startServer();
