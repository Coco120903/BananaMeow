import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const defaultProducts = [
  // Apparel
  {
    name: "Royal Banana Tee",
    category: "Apparel",
    price: 28,
    description: "Soft cotton tee with a chonky crown print.",
    inventory: 25,
    imageUrl: ""
  },
  {
    name: "Crown Cozy Hoodie",
    category: "Apparel",
    price: 54,
    description: "Plush hoodie with embroidered royal crest.",
    inventory: 15,
    imageUrl: ""
  },
  {
    name: "Royal Court Cap",
    category: "Apparel",
    price: 22,
    description: "Adjustable cap with subtle banana stitch.",
    inventory: 30,
    imageUrl: ""
  },
  // Cat Items
  {
    name: "Velvet Throne Toy",
    category: "Cat Items",
    price: 16,
    description: "Plush toy for dramatic pounces.",
    inventory: 40,
    imageUrl: ""
  },
  {
    name: "Lavender Litter Blend",
    category: "Cat Items",
    price: 24,
    description: "Low-dust, royal-approved comfort blend.",
    inventory: 20,
    imageUrl: ""
  },
  {
    name: "Royal Feather Wand",
    category: "Cat Items",
    price: 14,
    description: "Gold handle with irresistible feather flutter.",
    inventory: 35,
    imageUrl: ""
  },
  // Accessories
  {
    name: "Banana Meow Mug",
    category: "Accessories",
    price: 18,
    description: "Ceramic mug for royal-level sips.",
    inventory: 50,
    imageUrl: ""
  },
  {
    name: "Chonky Royal Stickers",
    category: "Accessories",
    price: 8,
    description: "Glossy sticker pack with royal expressions.",
    inventory: 100,
    imageUrl: ""
  },
  {
    name: "Royal Errands Tote",
    category: "Accessories",
    price: 20,
    description: "Canvas tote for snacks, treats, and drama.",
    inventory: 30,
    imageUrl: ""
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let createdCount = 0;
    let skippedCount = 0;

    for (const productData of defaultProducts) {
      // Check if product already exists by name (idempotent seeding)
      const existing = await Product.findOne({ name: productData.name });

      if (existing) {
        console.log(`Product "${productData.name}" already exists, skipping...`);
        skippedCount++;
      } else {
        await Product.create(productData);
        console.log(`Created product: ${productData.name} [${productData.category}]`);
        createdCount++;
      }
    }

    console.log(`\nSeeding complete!`);
    console.log(`Created: ${createdCount} products`);
    console.log(`Skipped: ${skippedCount} products (already exist)`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
