import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  total_amount: number;
  payment_method?: string;
  payment_status?: string;
  shipping_method?: string;
  shipping_fee?: number;
  shipping_status?: string;
  tracking_code?: string;
  shipping_address: string;
  receiver_name?: string;
  receiver_phone?: string;
  created_at?: Date;
  updated_at?: Date;
}

const OrderSchema = new Schema<IOrder>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  total_amount: { type: Number, required: true },
  payment_method: { type: String, enum: ["cod", "momo", "zalopay", "paypal"], default: "cod" },
  payment_status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  shipping_method: { type: String, enum: ["standard", "express", "pickup"], default: "standard" },
  shipping_fee: { type: Number, default: 0 },
  shipping_status: { type: String, enum: ["pending","processing","shipping","delivered","cancelled","returned"], default: "pending" },
  tracking_code: { type: String },
  shipping_address: { type: String, required: true },
  receiver_name: { type: String },
  receiver_phone: { type: String },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default mongoose.model<IOrder>("Order", OrderSchema);
