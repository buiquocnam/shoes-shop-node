import mongoose, { Schema, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  logo?: string;
  created_at: Date;
}

const BrandSchema = new Schema<IBrand>({
  name: { type: String, required: true },
  logo: String,
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IBrand>("Brand", BrandSchema);
