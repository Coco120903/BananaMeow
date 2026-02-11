import Category from "../models/Category.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_CATEGORY_IMAGE = "/placeholders/category-placeholder.png";

// @desc    Get all categories
// @route   GET /api/categories
export async function getCategories(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database not connected. Please try again later."
      });
    }
    const categories = await Category.find().sort({ displayName: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
}

// @desc    Get category by ID
// @route   GET /api/categories/:id
export async function getCategoryById(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database not connected. Please try again later."
      });
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Error fetching category" });
  }
}

// @desc    Create category
// @route   POST /api/categories
export async function createCategory(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database not connected. Please try again later."
      });
    }

    const { name, displayName, description } = req.body;

    // Validate required fields
    if (!name || !displayName) {
      return res.status(400).json({
        message: "Name and display name are required"
      });
    }

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({
      name: name.toLowerCase().trim()
    });
    if (existingCategory) {
      return res.status(400).json({
        message: "Category with this name already exists"
      });
    }

    const categoryData = {
      name: name.toLowerCase().trim(),
      displayName: displayName.trim(),
      description: description?.trim() || "",
      imageUrl: req.file ? `/uploads/categories/${req.file.filename}` : DEFAULT_CATEGORY_IMAGE
    };

    // Ensure categories directory exists
    const categoriesDir = path.join(__dirname, "../../uploads/categories");
    if (!fs.existsSync(categoriesDir)) {
      fs.mkdirSync(categoriesDir, { recursive: true });
    }

    // If file was uploaded, move it to categories folder
    if (req.file) {
      const oldPath = path.join(__dirname, "../../uploads", req.file.filename);
      const newPath = path.join(categoriesDir, req.file.filename);
      fs.renameSync(oldPath, newPath);
    }

    const category = await Category.create(categoryData);
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    // If file was uploaded but category creation failed, delete the file
    if (req.file) {
      const filePath = path.join(__dirname, "../../uploads", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
    res.status(500).json({ message: "Error creating category" });
  }
}

// @desc    Update category
// @route   PUT /api/categories/:id
export async function updateCategory(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database not connected. Please try again later."
      });
    }

    const { name, displayName, description, removeImage } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if name is being changed and if new name already exists
    if (name && name.toLowerCase().trim() !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.toLowerCase().trim(),
        _id: { $ne: req.params.id }
      });
      if (existingCategory) {
        return res.status(400).json({
          message: "Category with this name already exists"
        });
      }
    }

    // Handle image update/removal
    let newImageUrl = category.imageUrl;
    const categoriesDir = path.join(__dirname, "../../uploads/categories");
    
    if (req.file) {
      // New image uploaded, delete old one if it's not the default
      if (category.imageUrl && category.imageUrl !== DEFAULT_CATEGORY_IMAGE) {
        const oldImagePath = path.join(__dirname, "../../", category.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old category image:", err);
        });
      }
      // Move new file to categories folder
      const oldPath = path.join(__dirname, "../../uploads", req.file.filename);
      const newPath = path.join(categoriesDir, req.file.filename);
      if (!fs.existsSync(categoriesDir)) {
        fs.mkdirSync(categoriesDir, { recursive: true });
      }
      fs.renameSync(oldPath, newPath);
      newImageUrl = `/uploads/categories/${req.file.filename}`;
    } else if (removeImage === "true") {
      // Remove image requested, delete current image if not default
      if (category.imageUrl && category.imageUrl !== DEFAULT_CATEGORY_IMAGE) {
        const oldImagePath = path.join(__dirname, "../../", category.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting category image:", err);
        });
      }
      newImageUrl = DEFAULT_CATEGORY_IMAGE;
    }

    const updateData = {};
    if (name) updateData.name = name.toLowerCase().trim();
    if (displayName) updateData.displayName = displayName.trim();
    if (description !== undefined) updateData.description = description?.trim() || "";
    updateData.imageUrl = newImageUrl;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    // If file was uploaded but update failed, delete the file
    if (req.file) {
      const filePath = path.join(__dirname, "../../uploads", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
    res.status(500).json({ message: "Error updating category" });
  }
}

// @desc    Delete category
// @route   DELETE /api/categories/:id
export async function deleteCategory(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database not connected. Please try again later."
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if any products use this category
    const productsCount = await Product.countDocuments({
      category: { $regex: new RegExp(`^${category.displayName}$`, "i") }
    });

    if (productsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${productsCount} product(s) are using this category. Please reassign products first.`
      });
    }

    // Delete associated image file if it's not the default
    if (category.imageUrl && category.imageUrl !== DEFAULT_CATEGORY_IMAGE) {
      const imagePath = path.join(__dirname, "../../", category.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting category image:", err);
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
}
