import Cat from "../models/Cat.js";
import mongoose from "mongoose";

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
    const cat = await Cat.create(req.body);
    res.status(201).json(cat);
  } catch (error) {
    console.error("Error creating cat:", error);
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
    const cat = await Cat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!cat) {
      return res.status(404).json({ message: "Cat not found" });
    }
    res.json(cat);
  } catch (error) {
    console.error("Error updating cat:", error);
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
    res.json({ message: "Cat deleted successfully" });
  } catch (error) {
    console.error("Error deleting cat:", error);
    res.status(500).json({ message: "Error deleting cat" });
  }
}
