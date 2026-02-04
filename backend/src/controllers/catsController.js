import Cat from "../models/Cat.js";

export async function getCats(req, res) {
  const cats = await Cat.find().sort({ createdAt: -1 });
  res.json(cats);
}

export async function getCatById(req, res) {
  const cat = await Cat.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ message: "Cat not found" });
  }
  return res.json(cat);
}

export async function createCat(req, res) {
  const cat = await Cat.create(req.body);
  res.status(201).json(cat);
}
