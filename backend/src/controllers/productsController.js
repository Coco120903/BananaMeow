import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
}

export async function createProduct(req, res) {
  try {
    const productData = { ...req.body };
    
    // Convert price and inventory to numbers if they're strings (from FormData)
    if (typeof productData.price === "string") {
      productData.price = parseFloat(productData.price);
    }
    if (typeof productData.inventory === "string") {
      productData.inventory = parseInt(productData.inventory) || 0;
    }
    
    // If file was uploaded, set imageUrl
    if (req.file) {
      productData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    // If file was uploaded but product creation failed, delete the file
    if (req.file) {
      const filePath = path.join(__dirname, "../../uploads", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
    res.status(500).json({ message: "Error creating product" });
  }
}

export async function updateProduct(req, res) {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const productData = { ...req.body };
    
    // Convert price and inventory to numbers if they're strings (from FormData)
    if (typeof productData.price === "string") {
      productData.price = parseFloat(productData.price);
    }
    if (typeof productData.inventory === "string") {
      productData.inventory = parseInt(productData.inventory) || 0;
    }
    
    // If new file was uploaded
    if (req.file) {
      // Delete old image file if it exists
      if (existingProduct.imageUrl && existingProduct.imageUrl.startsWith("/uploads/")) {
        const oldFilePath = path.join(__dirname, "../../", existingProduct.imageUrl);
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Failed to delete old image:", err);
          }
        });
      }
      productData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.removeImage === "true") {
      // If removeImage flag is set, delete the image
      if (existingProduct.imageUrl && existingProduct.imageUrl.startsWith("/uploads/")) {
        const oldFilePath = path.join(__dirname, "../../", existingProduct.imageUrl);
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Failed to delete old image:", err);
          }
        });
      }
      productData.imageUrl = "";
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true
    });
    
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    // If file was uploaded but update failed, delete the file
    if (req.file) {
      const filePath = path.join(__dirname, "../../uploads", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
    res.status(500).json({ message: "Error updating product" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Delete associated image file if it exists
    if (product.imageUrl && product.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "../../", product.imageUrl);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete product image:", err);
        }
      });
    }
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
}
