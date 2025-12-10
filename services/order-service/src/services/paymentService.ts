import Payment from "../models/Payment";
import Order from "../models/Order";
import createError from "http-errors";

class PaymentService {
  /**
   * Create a new payment
   */
  async createPayment(order_id: string, amount: number, method: string, transaction_id?: string) {
    try {
      // Verify order exists
      const order = await Order.findById(order_id);
      if (!order) {
        throw createError.NotFound("Order not found");
      }

      // Validate payment method
      const validMethods = ["cod", "momo", "zalopay", "paypal"];
      if (!validMethods.includes(method)) {
        throw createError.BadRequest(`Invalid payment method. Must be one of: ${validMethods.join(", ")}`);
      }

      // COD doesn't need transaction ID
      let status = "pending";
      if (method === "cod") {
        status = "pending"; // COD payment status stays pending until delivery confirmation
      }

      const payment = await Payment.create({
        order_id,
        amount,
        method,
        status,
        transaction_id,
      });

      return payment;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to create payment");
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string) {
    try {
      const payment = await Payment.findById(paymentId).populate("order_id");
      if (!payment) {
        throw createError.NotFound("Payment not found");
      }
      return payment;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get payment");
    }
  }

  /**
   * Get payments by order ID
   */
  async getPaymentsByOrderId(order_id: string) {
    try {
      const payments = await Payment.find({ order_id }).sort({ created_at: -1 });
      return payments;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get payments");
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(paymentId: string, status: string) {
    try {
      const validStatuses = ["pending", "success", "failed"];
      if (!validStatuses.includes(status)) {
        throw createError.BadRequest(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      }

      const payment = await Payment.findByIdAndUpdate(
        paymentId,
        { status },
        { new: true }
      );

      if (!payment) {
        throw createError.NotFound("Payment not found");
      }

      // Update order payment status if payment is successful
      if (status === "success") {
        await Order.findByIdAndUpdate(payment.order_id, { payment_status: "paid" });
      } else if (status === "failed") {
        await Order.findByIdAndUpdate(payment.order_id, { payment_status: "failed" });
      }

      return payment;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to update payment status");
    }
  }

  /**
   * Get all payments (admin only)
   */
  async getAllPayments(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const payments = await Payment.find()
        .populate("order_id")
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      const total = await Payment.countDocuments();

      return {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to get payments");
    }
  }

  /**
   * Delete payment
   */
  async deletePayment(paymentId: string) {
    try {
      const payment = await Payment.findByIdAndDelete(paymentId);
      if (!payment) {
        throw createError.NotFound("Payment not found");
      }
      return payment;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to delete payment");
    }
  }

  /**
   * Verify payment with transaction ID (for online payment verification)
   */
  async verifyPayment(paymentId: string, transactionId: string) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw createError.NotFound("Payment not found");
      }

      if (payment.transaction_id !== transactionId) {
        throw createError.BadRequest("Transaction ID mismatch");
      }

      // Here you would call payment gateway API to verify
      // For now, mark as success if transaction ID matches
      payment.status = "success";
      await payment.save();

      return payment;
    } catch (err: any) {
      throw createError(err.status || 500, err.message || "Failed to verify payment");
    }
  }
}

export default new PaymentService();
