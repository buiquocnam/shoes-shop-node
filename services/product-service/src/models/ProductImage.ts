import mongoose, { Schema, Document } from "mongoose";

export interface IProductImage extends Document {
  product_id: mongoose.Types.ObjectId;
  image_url: string;
  isPrimary?: boolean;
}

const ProductImageSchema = new Schema<IProductImage>({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  image_url: { type: String, required: true },
  isPrimary: Boolean,
});

export default mongoose.model<IProductImage>("ProductImage", ProductImageSchema);
