import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  parent_id?: mongoose.Types.ObjectId;
  created_at: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: String,
  parent_id: { type: Schema.Types.ObjectId, ref: "Category" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<ICategory>("Category", CategorySchema);
