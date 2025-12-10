// src/types/order.types.ts

import { Types } from "mongoose";

export interface cartItemDTO {
    cart_id : string;
    product_variant_id: Types.ObjectId;
    quantity: number;
}

export interface cartDTO {
    user_id: Types.ObjectId;
    items: cartItemDTO[];
}

export interface orderDTO {
    user_id: Types.ObjectId;
    cart_id: Types.ObjectId;
    shipping_address: string;
    payment_method: string;
}

export interface orderItemDTO {
    product_variant_id: Types.ObjectId;
    quantity: number;
    price: number;
}   

export interface paymentDTO {
    order_id: Types.ObjectId;
    amount: number;
    method: string;
}

export interface shippingDTO  {
    order_id: Types.ObjectId;
    method: string;
    address: string;
}

