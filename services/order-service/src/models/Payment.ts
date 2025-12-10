import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  order_id: mongoose.Types.ObjectId;
  amount: number;
  method: string;
  status?: string;
  transaction_id?: string;
  created_at?: Date;
}

const PaymentSchema = new Schema<IPayment>({
  order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["cod","momo","zalopay","paypal"], required: true },
  status: { type: String, enum: ["pending","success","failed"], default: "pending" },
  transaction_id: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IPayment>("Payment", PaymentSchema);
