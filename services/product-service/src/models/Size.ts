import mongoose, { Schema, Document } from "mongoose";

export interface ISize extends Document {
  sizeLabel: Number;
}

const SizeSchema = new Schema<ISize>({
  sizeLabel: { type: Number, required: true },
});

export default mongoose.model<ISize>("Size", SizeSchema);
