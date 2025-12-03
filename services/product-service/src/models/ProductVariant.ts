import mongoose, { Schema, Document } from "mongoose";

export interface IProductVariant extends Document {
  product_id: mongoose.Types.ObjectId;
  color?: string;
  size_id?: mongoose.Types.ObjectId;
  stock?: number;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  color: String,
  size_id: { type: Schema.Types.ObjectId, ref: "Size" },
  stock: Number,
});

export default mongoose.model<IProductVariant>("ProductVariant", ProductVariantSchema);
