import mongoose from "mongoose";

const catSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nickname: { type: String, required: true, trim: true },
    traits: [{ type: String, required: true }],
    funFact: { type: String, required: true, trim: true },
    favoriteThing: { type: String, required: true, trim: true },
    personality: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Cat", catSchema);
