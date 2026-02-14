import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Category from "../models/Category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const defaultCategories = [
  {
    name: "apparel",
    displayName: "Apparel",
    description: "Soft tees, hoodies, and royal everyday fits designed with love.",
    imageUrl: ""
  },
  {
    name: "cat-items",
    displayName: "Cat Items",
    description: "Premium toys, treats, and essentials for your chonky royalty.",
    imageUrl: ""
  },
  {
    name: "accessories",
    displayName: "Accessories",
    description: "Stickers, mugs, totes, and royal extras for everyday charm.",
    imageUrl: ""
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let createdCount = 0;
    let skippedCount = 0;

    for (const categoryData of defaultCategories) {
      // Check if category already exists
      const existing = await Category.findOne({ name: categoryData.name });
      
      if (existing) {
        console.log(`Category "${categoryData.displayName}" already exists, skipping...`);
        skippedCount++;
      } else {
        await Category.create(categoryData);
        console.log(`Created category: ${categoryData.displayName}`);
        createdCount++;
      }
    }

    console.log(`\nSeeding complete!`);
    console.log(`Created: ${createdCount} categories`);
    console.log(`Skipped: ${skippedCount} categories (already exist)`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
