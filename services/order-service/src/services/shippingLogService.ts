import ShippingLog from "../models/ShippingLog";
import Order from "../models/Order";
import createError from "http-errors";

class ShippingLogService {
  /**
   * Create a new shipping log entry
   */
  async createShippingLog(order_id: string, status: string, note?: string) {
    try {
      // Verify order exists
      const order = await Order.findById(order_id);
      if (!order) {
        throw createError.NotFound("Order not found");
      }

      // Validate shipping status
      const validStatuses = ["processing", "pickup", "shipping", "delivered", "failed", "returned"];
      if (!validStatuses.includes(status)) {
        throw createError.BadRequest(`Invalid shipping status. Must be one of: ${validStatuses.join(", ")}`);
      }

      const shippingLog = await ShippingLog.create({
        order_id,
        status,
        note,
        updated_at: new Date(),
      });

      // Update order shipping status
      await Order.findByIdAndUpdate(order_id, { shipping_status: status });

      return shippingLog;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to create shipping log");
    }
  }

  /**
   * Get shipping log by ID
   */
  async getShippingLogById(logId: string) {
    try {
      const log = await ShippingLog.findById(logId).populate("order_id");
      if (!log) {
        throw createError.NotFound("Shipping log not found");
      }
      return log;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get shipping log");
    }
  }

  /**
   * Get all shipping logs for an order
   */
  async getShippingLogsByOrderId(order_id: string) {
    try {
      const logs = await ShippingLog.find({ order_id }).sort({ updated_at: -1 });
      return logs;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get shipping logs");
    }
  }

  /**
   * Update shipping log (note only)
   */
  async updateShippingLog(logId: string, note?: string) {
    try {
      const log = await ShippingLog.findByIdAndUpdate(
        logId,
        { note, updated_at: new Date() },
        { new: true }
      );

      if (!log) {
        throw createError.NotFound("Shipping log not found");
      }

      return log;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to update shipping log");
    }
  }

  /**
   * Get all shipping logs (admin only)
   */
  async getAllShippingLogs(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const logs = await ShippingLog.find()
        .populate("order_id")
        .skip(skip)
        .limit(limit)
        .sort({ updated_at: -1 });

      const total = await ShippingLog.countDocuments();

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get shipping logs");
    }
  }

  /**
   * Delete shipping log
   */
  async deleteShippingLog(logId: string) {
    try {
      const log = await ShippingLog.findByIdAndDelete(logId);
      if (!log) {
        throw createError.NotFound("Shipping log not found");
      }
      return log;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to delete shipping log");
    }
  }

  /**
   * Get shipping history for a user (all orders' shipping logs)
   */
  async getUserShippingHistory(user_id: string) {
    try {
      const orders = await Order.find({ user_id });
      const orderIds = orders.map((o) => o._id);

      const logs = await ShippingLog.find({ order_id: { $in: orderIds } })
        .populate("order_id")
        .sort({ updated_at: -1 });

      return logs;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get user shipping history");
    }
  }

  /**
   * Track order by tracking code
   */
  async trackOrder(tracking_code: string) {
    try {
      const order = await Order.findOne({ tracking_code });
      if (!order) {
        throw createError.NotFound("Order not found with this tracking code");
      }

      const logs = await ShippingLog.find({ order_id: order._id }).sort({ updated_at: -1 });

      return {
        order,
        logs,
      };
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to track order");
    }
  }
}

export default new ShippingLogService();
