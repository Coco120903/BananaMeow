import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getProducts(req, res) {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
      inStock,
      paginated
    } = req.query;

    // Check if any advanced query params are used
    const useAdvanced = search || category || minPrice || maxPrice || sort || page || limit || inStock || paginated;

    const filter = {};

    // Text search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Category filter
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // In-stock filter
    if (inStock === "true") {
      filter.inventory = { $gt: 0 };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case "price-asc": sortOption = { price: 1 }; break;
        case "price-desc": sortOption = { price: -1 }; break;
        case "rating": sortOption = { avgRating: -1 }; break;
        case "name-asc": sortOption = { name: 1 }; break;
        case "name-desc": sortOption = { name: -1 }; break;
        case "newest": sortOption = { createdAt: -1 }; break;
        case "oldest": sortOption = { createdAt: 1 }; break;
        default: sortOption = { createdAt: -1 };
      }
    }

    // If no advanced params, return plain array (backward compatible)
    if (!useAdvanced) {
      const products = await Product.find(filter).sort(sortOption);
      return res.json(products);
    }

    // Paginated response
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total
    });
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
