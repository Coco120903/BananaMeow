import mongoose from "mongoose";

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

  await mongoose.connect(mongoUri);
}
