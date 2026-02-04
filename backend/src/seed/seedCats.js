import dotenv from "dotenv";
import mongoose from "mongoose";
import Cat from "../models/Cat.js";

dotenv.config();

const cats = [
  {
    name: "Bane",
    nickname: "The Velvet Tank",
    traits: ["Stoic", "Observant", "Snack-focused"],
    funFact: "Can nap through thunderstorms.",
    favoriteThing: "Silky blankets",
    personality: "Quiet protector with a dramatic gaze."
  },
  {
    name: "Nana",
    nickname: "Queen of Naps",
    traits: ["Regal", "Gentle", "Dramatic sighs"],
    funFact: "Prefers bowls aligned by size.",
    favoriteThing: "Fresh tuna",
    personality: "Soft-spoken ruler with strict snack standards."
  },
  {
    name: "Angela",
    nickname: "Food Inspector",
    traits: ["Curious", "Bold", "Clumsy-cute"],
    funFact: "Knows the sound of the treat drawer.",
    favoriteThing: "Warm windowsills",
    personality: "Loud loyalty and a royal appetite."
  },
  {
    name: "Biscuit",
    nickname: "Duke of Zoomies",
    traits: ["Playful", "Fast", "Dramatic"],
    funFact: "Zooms after every meal.",
    favoriteThing: "Crinkle toys",
    personality: "A chaotic ray of sunshine."
  },
  {
    name: "Pearl",
    nickname: "Lady Lullaby",
    traits: ["Sweet", "Sleepy", "Cuddly"],
    funFact: "Purrs in her sleep.",
    favoriteThing: "Warm laps",
    personality: "A gentle cuddle monarch."
  },
  {
    name: "Sable",
    nickname: "Night Watch",
    traits: ["Brave", "Alert", "Protective"],
    funFact: "Guards doors with a heroic stare.",
    favoriteThing: "Tall perches",
    personality: "Royal security chief."
  },
  {
    name: "Mocha",
    nickname: "Snack General",
    traits: ["Strategic", "Food-motivated", "Confident"],
    funFact: "Can open treat containers.",
    favoriteThing: "Crunchy kibble",
    personality: "Leads all snack negotiations."
  },
  {
    name: "Luna",
    nickname: "Moonbeam Duchess",
    traits: ["Dreamy", "Quiet", "Elegant"],
    funFact: "Sleeps in perfect circles.",
    favoriteThing: "Soft pillows",
    personality: "Graceful and serene."
  },
  {
    name: "Mochi",
    nickname: "Court Jester",
    traits: ["Goofy", "Curious", "Friendly"],
    funFact: "Trips over her own tail.",
    favoriteThing: "Feather wand",
    personality: "Keeps morale high with silly antics."
  },
  {
    name: "Clover",
    nickname: "Garden Countess",
    traits: ["Curious", "Calm", "Observant"],
    funFact: "Watches birds like a scientist.",
    favoriteThing: "Sun patches",
    personality: "Nature-loving royal."
  },
  {
    name: "Pumpkin",
    nickname: "Sir Snore",
    traits: ["Sleepy", "Gentle", "Lovable"],
    funFact: "Snores like a tiny engine.",
    favoriteThing: "Fuzzy blankets",
    personality: "A comforting cuddle knight."
  },
  {
    name: "Opal",
    nickname: "Crown Jewel",
    traits: ["Elegant", "Sassy", "Magnetic"],
    funFact: "Collects shiny toys.",
    favoriteThing: "Dangly charms",
    personality: "The sparkle in the royal crown."
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Cat.deleteMany();
  await Cat.insertMany(cats);
  console.log("Seeded cats");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
