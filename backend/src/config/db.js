import mongoose from "mongoose";

// Disable mongoose buffering to prevent timeout errors
mongoose.set("bufferCommands", false);

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}
