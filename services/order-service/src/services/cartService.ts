import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import createError from "http-errors";
import mongoose from "mongoose";
import { cartDTO } from "../types/order.types";

class CartService {

  // 🟦 Tạo cart mới cho user (nếu user chưa có cart)
  async createCart(cartData: cartDTO) {
    const { user_id } = cartData;

    const existed = await Cart.findOne({ user_id });
    if (existed) return existed;

    const cart = await Cart.create({ user_id });
    return cart;
  }

  // 🟩 Lấy cart và items theo user_id
  async getCartByUser(userId: string) {
    const cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return null;
    }

    const items = await CartItem.find({ cart_id: cart._id }).populate("product_variant_id");
    return { cart, items };
  }

  // 🟧 Thêm item vào cart
  async addItemToCart(userId: string, product_variant_id: string, quantity: number) {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    const existedItem = await CartItem.findOne({
      cart_id: cart._id,
      product_variant_id
    });

    if (existedItem) {
      existedItem.quantity += quantity;
      await existedItem.save();
      return existedItem;
    }

    const newItem = await CartItem.create({
      cart_id: cart._id,
      product_variant_id,
      quantity
    });

    return newItem;
  }

  // 🟨 Cập nhật số lượng item trong cart
  async updateItemQuantity(userId: string, product_variant_id: string, quantity: number) {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) throw createError.NotFound("Cart not found");

    const item = await CartItem.findOne({
      cart_id: cart._id,
      product_variant_id
    });

    if (!item) throw createError.NotFound("Item not found in cart");

    if (quantity <= 0) {
      await item.deleteOne();
      return { deleted: true };
    }

    item.quantity = quantity;
    await item.save();

    return item;
  }

  // 🟥 Xóa một item trong cart
  async removeItem(userId: string, product_variant_id: string) {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) throw createError.NotFound("Cart not found");

    await CartItem.deleteOne({
      cart_id: cart._id,
      product_variant_id
    });

    return { message: "Item removed" };
  }

  // 🟪 Xóa toàn bộ cart (khi đã checkout)
  async clearCart(cartId: string) {
    try {
      await CartItem.deleteMany({ cart_id: cartId });
      const cart = await Cart.findByIdAndDelete(cartId);

      if (!cart) {
        throw createError.NotFound("Cart not found");
      }

      return { message: "Cart cleared" };
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to clear cart");
    }
  }

  // Get cart by ID
  async getCartById(cartId: string) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw createError.NotFound("Cart not found");
      }

      const items = await CartItem.find({ cart_id: cartId }).populate("product_variant_id");
      return { cart, items };
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get cart");
    }
  }

  // Delete cart by ID
  async deleteCart(cartId: string) {
    try {
      await CartItem.deleteMany({ cart_id: cartId });
      const cart = await Cart.findByIdAndDelete(cartId);

      if (!cart) {
        throw createError.NotFound("Cart not found");
      }

      return cart;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to delete cart");
    }
  }

  // Get all carts (admin only)
  async getAllCarts(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const carts = await Cart.find()
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      const total = await Cart.countDocuments();

      // Populate items for each cart
      const cartsWithItems = await Promise.all(
        carts.map(async (cart) => {
          const items = await CartItem.find({ cart_id: cart._id }).populate("product_variant_id");
          return { cart, items };
        })
      );

      return {
        carts: cartsWithItems,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get carts");
    }
  }

  // Get cart total price
  async getCartTotal(userId: string): Promise<number> {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      if (!cart) {
        throw createError.NotFound("Cart not found");
      }

      const items = await CartItem.find({ cart_id: cart._id });
      const total = items.reduce((sum, item) => sum + item.total_price, 0);

      return total;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to calculate cart total");
    }
  }

  // Get cart item count
  async getCartItemCount(userId: string): Promise<number> {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      if (!cart) {
        throw createError.NotFound("Cart not found");
      }

      const count = await CartItem.countDocuments({ cart_id: cart._id });
      return count;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to count cart items");
    }
  }

  // Check if cart is empty
  async isCartEmpty(userId: string): Promise<boolean> {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      if (!cart) return true;

      const count = await CartItem.countDocuments({ cart_id: cart._id });
      return count === 0;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to check if cart is empty");
    }
  }
}

export default new CartService();
