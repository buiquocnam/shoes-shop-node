import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  category_id?: mongoose.Types.ObjectId;
  brand_id?: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount?: number;
  stock?: number;
  status: "active" | "inactive";
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProduct>({
  category_id: { type: Schema.Types.ObjectId, ref: "Category" },
  brand_id: { type: Schema.Types.ObjectId, ref: "Brand" },
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  price: { type: Number, required: true },
  discount: Number,
  stock: Number,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<IProduct>("Product", ProductSchema);
