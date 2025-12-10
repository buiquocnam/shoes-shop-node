import { Schema, model, Types } from "mongoose";

export interface ICartItem {
    cart_id: Types.ObjectId;
    product_variant_id: Types.ObjectId;
    quantity: number;
    price: number;
    total_price: number;
}

const CartItemSchema = new Schema<ICartItem>(
    {
        cart_id: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
        product_variant_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },

        quantity: { type: Number, required: true },

        // Giá tại thời điểm thêm vào giỏ
        price: { type: Number, required: true },

        // quantity * price
        total_price: { type: Number, required: true },
    },
    { timestamps: true }
);

export default model<ICartItem>("CartItem", CartItemSchema);
