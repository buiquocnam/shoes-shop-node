// src/models/index.ts
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

import Brand from "./Brand";
import Category from "./Category";
import Product from "./Product";
import ProductImage from "./ProductImage";
import ProductVariant from "./ProductVariant";
import Size from "./Size";
import Review from "./Review";

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.DATABASE_URL;
    if (!mongoURI) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Export models để import dễ dàng trong các service khác
export {
  Brand,
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Size,
  Review,
  connectDB,
};

