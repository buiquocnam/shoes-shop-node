import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem extends Document {
  order_id: mongoose.Types.ObjectId;
  product_variant_id: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

const OrderItemSchema = new Schema<IOrderItem>({
  order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  product_variant_id: { type: Schema.Types.ObjectId, ref: "ProductVariant", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

export default mongoose.model<IOrderItem>("OrderItem", OrderItemSchema);
