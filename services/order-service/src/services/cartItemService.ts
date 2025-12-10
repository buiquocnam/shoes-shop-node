import CartItem from "../models/CartItem";
import Cart from "../models/Cart";
import { ProductClient } from "../clients/ProductClient";
import createError from "http-errors";
import { cartItemDTO } from "../types/order.types";

export class CartItemService {

    async addItemToCart(data: cartItemDTO) {
        try {
            const { cart_id, product_variant_id, quantity } = data;

            if (!cart_id || !product_variant_id || !quantity) {
                throw new createError.BadRequest("cart_id, product_variant_id, quantity are required");
            }

            if (quantity <= 0) {
                throw new createError.BadRequest("Quantity must be greater than 0");
            }

            const cart = await Cart.findById(cart_id);
            if (!cart) throw new createError.NotFound("Cart not found");

            // 🔥 GỌI product-service để lấy giá sản phẩm
            const variant = await ProductClient.getVariantById(String(product_variant_id));
            if (!variant) throw new createError.NotFound("Product variant not found");

            const existItem = await CartItem.findOne({ cart_id, product_variant_id });

            if (existItem) {
                existItem.quantity += quantity;
                existItem.total_price = existItem.quantity * variant.price;
                await existItem.save();
                return existItem;
            }

            const newItem = await CartItem.create({
                cart_id,
                product_variant_id,
                quantity,
                price: variant.price,
                total_price: variant.price * quantity,
            });

            return newItem;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Failed to add item to cart");
        }
    }

    /**
     * Get cart item by ID
     */
    async getCartItemById(itemId: string) {
        try {
            const item = await CartItem.findById(itemId).populate("product_variant_id");
            if (!item) {
                throw createError.NotFound("Cart item not found");
            }
            return item;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Failed to get cart item");
        }
    }

    /**
     * Get all items in a cart
     */
    async getCartItems(cart_id: string) {
        try {
            const cart = await Cart.findById(cart_id);
            if (!cart) {
                throw createError.NotFound("Cart not found");
            }

            const items = await CartItem.find({ cart_id }).populate("product_variant_id");
            return items;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Failed to get cart items");
        }
    }

    /**
     * Update cart item quantity
     */
    async updateItemQuantity(itemId: string, quantity: number) {
        try {
            if (quantity <= 0) {
                throw createError.BadRequest("Quantity must be greater than 0");
            }

            const item = await CartItem.findById(itemId);
            if (!item) {
                throw createError.NotFound("Cart item not found");
            }

            item.quantity = quantity;
            item.total_price = item.price * quantity;
            await item.save();

            return item;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Failed to update cart item");
        }
    }

    /**
     * Remove item from cart
     */
    async removeItemFromCart(itemId: string) {
        try {
            const item = await CartItem.findByIdAndDelete(itemId);
            if (!item) {
                throw createError.NotFound("Cart item not found");
            }
            return item;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Failed to remove cart item");
        }
    }

    /**
     * Calculate cart subtotal
     */
    async calculateCartTotal(cart_id: string): Promise<number> {
        try {
            const items = await CartItem.find({ cart_id });
            const total = items.reduce((sum, item) => sum + item.total_price, 0);
            return total;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Failed to calculate cart total");
        }
    }

    /**
     * Get all cart items (admin only)
     */
    async getAllCartItems(page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            const items = await CartItem.find()
                .populate("product_variant_id")
                .skip(skip)
                .limit(limit);

            const total = await CartItem.countDocuments();

            return {
                items,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Failed to get cart items");
        }
    }

    /**
     * Validate cart item before checkout
     */
    async validateCartItem(itemId: string): Promise<boolean> {
        try {
            const item = await CartItem.findById(itemId).populate("product_variant_id");
            if (!item) {
                return false;
            }

            // Check if product is still available
            const variant = await ProductClient.getVariantById(String(item.product_variant_id._id));
            return variant !== null;
        } catch (err: any) {
            return false;
        }
    }

    /**
     * Validate all items in cart
     */
    async validateAllCartItems(cart_id: string): Promise<boolean> {
        try {
            const items = await CartItem.find({ cart_id });

            for (const item of items) {
                const variant = await ProductClient.getVariantById(String(item.product_variant_id));
                if (!variant) {
                    return false;
                }
            }

            return true;
        } catch (err: any) {
            return false;
        }
    }
}
