import Cat from "../models/Cat.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getCats(req, res) {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: "Database not connected. Please try again later." 
      });
    }
    const cats = await Cat.find().sort({ createdAt: -1 });
    res.json(cats);
  } catch (error) {
    console.error("Error fetching cats:", error);
    res.status(500).json({ message: "Error fetching cats" });
  }
}

export async function getCatById(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: "Database not connected. Please try again later." 
      });
    }
    const cat = await Cat.findById(req.params.id);
    if (!cat) {
      return res.status(404).json({ message: "Cat not found" });
    }
    return res.json(cat);
  } catch (error) {
    console.error("Error fetching cat:", error);
    res.status(500).json({ message: "Error fetching cat" });
  }
}

export async function createCat(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: "Database not connected. Please try again later." 
      });
    }
    
    const catData = { ...req.body };
    
    // Handle traits - if it's a string (from FormData), convert to array
    if (typeof catData.traits === "string" && catData.traits) {
      catData.traits = catData.traits.split(",").map((t) => t.trim()).filter(Boolean);
    }
    
    // If file was uploaded, set imageUrl
    if (req.file) {
      catData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const cat = await Cat.create(catData);
    res.status(201).json(cat);
  } catch (error) {
    console.error("Error creating cat:", error);
    // If file was uploaded but cat creation failed, delete the file
    if (req.file) {
      const filePath = path.join(__dirname, "../../uploads", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
    res.status(500).json({ message: "Error creating cat" });
  }
}

export async function updateCat(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: "Database not connected. Please try again later." 
      });
    }
    
    const existingCat = await Cat.findById(req.params.id);
    if (!existingCat) {
      return res.status(404).json({ message: "Cat not found" });
    }
    
    const catData = { ...req.body };
    
    // Handle traits - if it's a string (from FormData), convert to array
    if (typeof catData.traits === "string" && catData.traits) {
      catData.traits = catData.traits.split(",").map((t) => t.trim()).filter(Boolean);
    }
    
    // If new file was uploaded
    if (req.file) {
      // Delete old image file if it exists
      if (existingCat.imageUrl && existingCat.imageUrl.startsWith("/uploads/")) {
        const oldFilePath = path.join(__dirname, "../../", existingCat.imageUrl);
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Failed to delete old image:", err);
          }
        });
      }
      catData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.removeImage === "true") {
      // If removeImage flag is set, delete the image
      if (existingCat.imageUrl && existingCat.imageUrl.startsWith("/uploads/")) {
        const oldFilePath = path.join(__dirname, "../../", existingCat.imageUrl);
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Failed to delete old image:", err);
          }
        });
      }
      catData.imageUrl = "";
    }
    
    const cat = await Cat.findByIdAndUpdate(req.params.id, catData, {
      new: true,
      runValidators: true
    });
    
    res.json(cat);
  } catch (error) {
    console.error("Error updating cat:", error);
    // If file was uploaded but update failed, delete the file
    if (req.file) {
      const filePath = path.join(__dirname, "../../uploads", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
    res.status(500).json({ message: "Error updating cat" });
  }
}

export async function deleteCat(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: "Database not connected. Please try again later." 
      });
    }
    const cat = await Cat.findByIdAndDelete(req.params.id);
    if (!cat) {
      return res.status(404).json({ message: "Cat not found" });
    }
    
    // Delete associated image file if it exists
    if (cat.imageUrl && cat.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "../../", cat.imageUrl);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete cat image:", err);
        }
      });
    }
    
    res.json({ message: "Cat deleted successfully" });
  } catch (error) {
    console.error("Error deleting cat:", error);
    res.status(500).json({ message: "Error deleting cat" });
  }
}
