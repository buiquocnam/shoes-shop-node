import mongoose, { Schema, Document } from "mongoose";

export interface IShippingLog extends Document {
  order_id: mongoose.Types.ObjectId;
  status: string;
  note?: string;
  updated_at?: Date;
}

const ShippingLogSchema = new Schema<IShippingLog>({
  order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  status: { type: String, enum: ["processing","pickup","shipping","delivered","failed","returned"], required: true },
  note: { type: String },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<IShippingLog>("ShippingLog", ShippingLogSchema);
