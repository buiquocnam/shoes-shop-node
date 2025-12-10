import OrderItem from "../models/OrderItem";
import Order from "../models/Order";
import createError from "http-errors";

class OrderItemService {
  /**
   * Create a new order item
   */
  async createOrderItem(order_id: string, product_variant_id: string, quantity: number, price: number) {
    try {
      // Verify order exists
      const order = await Order.findById(order_id);
      if (!order) {
        throw createError.NotFound("Order not found");
      }

      // Validate quantity and price
      if (quantity <= 0) {
        throw createError.BadRequest("Quantity must be greater than 0");
      }

      if (price < 0) {
        throw createError.BadRequest("Price cannot be negative");
      }

      const orderItem = await OrderItem.create({
        order_id,
        product_variant_id,
        quantity,
        price,
      });

      return orderItem;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to create order item");
    }
  }

  /**
   * Get order item by ID
   */
  async getOrderItemById(itemId: string) {
    try {
      const item = await OrderItem.findById(itemId).populate("order_id");
      if (!item) {
        throw createError.NotFound("Order item not found");
      }
      return item;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get order item");
    }
  }

  /**
   * Get all order items for a specific order
   */
  async getOrderItemsByOrderId(order_id: string) {
    try {
      const items = await OrderItem.find({ order_id });
      return items;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get order items");
    }
  }

  /**
   * Update order item (quantity and price)
   */
  async updateOrderItem(itemId: string, quantity?: number, price?: number) {
    try {
      const updates: any = {};

      if (quantity !== undefined) {
        if (quantity <= 0) {
          throw createError.BadRequest("Quantity must be greater than 0");
        }
        updates.quantity = quantity;
      }

      if (price !== undefined) {
        if (price < 0) {
          throw createError.BadRequest("Price cannot be negative");
        }
        updates.price = price;
      }

      if (Object.keys(updates).length === 0) {
        throw createError.BadRequest("No fields to update");
      }

      const item = await OrderItem.findByIdAndUpdate(itemId, updates, { new: true });

      if (!item) {
        throw createError.NotFound("Order item not found");
      }

      return item;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to update order item");
    }
  }

  /**
   * Delete order item
   */
  async deleteOrderItem(itemId: string) {
    try {
      const item = await OrderItem.findByIdAndDelete(itemId);
      if (!item) {
        throw createError.NotFound("Order item not found");
      }
      return item;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to delete order item");
    }
  }

  /**
   * Get all order items (admin only)
   */
  async getAllOrderItems(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const items = await OrderItem.find()
        .populate("order_id")
        .skip(skip)
        .limit(limit);

      const total = await OrderItem.countDocuments();

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
      throw createError(err.status || 500, err.message || "Failed to get order items");
    }
  }

  /**
   * Get order items for a user (across all orders)
   */
  async getUserOrderItems(user_id: string) {
    try {
      const orders = await Order.find({ user_id });
      const orderIds = orders.map((o) => o._id);

      const items = await OrderItem.find({ order_id: { $in: orderIds } }).populate("order_id");

      return items;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get user order items");
    }
  }

  /**
   * Calculate order total from items
   */
  async calculateOrderTotal(order_id: string): Promise<number> {
    try {
      const items = await OrderItem.find({ order_id });
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return total;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to calculate order total");
    }
  }

  /**
   * Batch create order items (for order checkout)
   */
  async createBatchOrderItems(order_id: string, items: Array<{ product_variant_id: string; quantity: number; price: number }>) {
    try {
      // Verify order exists
      const order = await Order.findById(order_id);
      if (!order) {
        throw createError.NotFound("Order not found");
      }

      if (!items || items.length === 0) {
        throw createError.BadRequest("Order items cannot be empty");
      }

      // Validate all items
      for (const item of items) {
        if (item.quantity <= 0) {
          throw createError.BadRequest("Quantity must be greater than 0");
        }
        if (item.price < 0) {
          throw createError.BadRequest("Price cannot be negative");
        }
      }

      const orderItems = await OrderItem.insertMany(
        items.map((item) => ({
          order_id,
          ...item,
        }))
      );

      return orderItems;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to create order items");
    }
  }
}

export default new OrderItemService();
