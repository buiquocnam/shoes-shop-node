import mongoose from "mongoose";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import createError from "http-errors";

class OrderService {
  // Tạo order từ cartId (atomic)
  async createOrderFromCart({ userId, cartId, shipping_address, receiver_name, receiver_phone, payment_method = "cod", shipping_method = "standard" }: {
    userId: string,
    cartId: string,
    shipping_address: string,
    receiver_name?: string,
    receiver_phone?: string,
    payment_method?: string,
    shipping_method?: string
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. lấy cart items
      const cart = await Cart.findById(cartId).session(session);
      if (!cart) throw createError.NotFound("Cart not found");
      if (cart.user_id.toString() !== userId) throw createError.Forbidden("Cart does not belong to user");

      const cartItems = await CartItem.find({ cart_id: cartId }).session(session);
      if (!cartItems || cartItems.length === 0) throw createError.BadRequest("Cart is empty");

      // 2. tính tổng (lấy price từ ProductVariant)
      let total = 0;
      // NOTE: giả định bạn có model ProductVariant và price field
      const ProductVariant = mongoose.model("ProductVariant");
      const orderItemsData: any[] = [];

      for (const ci of cartItems) {
        const pv: any = await ProductVariant.findById(ci.product_variant_id).session(session);
        if (!pv) {
          await session.abortTransaction();
          throw createError.NotFound(`Product variant ${ci.product_variant_id} not found`);
        }
        const price = pv.price as number;
        const subtotal = price * ci.quantity;
        total += subtotal;

        orderItemsData.push({
          product_variant_id: pv._id,
          quantity: ci.quantity,
          price,
        });
      }

      // 3. thêm shipping fee nếu cần (ở đây tạm 0 hoặc theo shipping_method)
      const shipping_fee = shipping_method === "express" ? 30 : 0;
      const total_amount = total + shipping_fee;

      // 4. tạo order
      const newOrder = await Order.create([{
        user_id: userId,
        total_amount,
        payment_method,
        payment_status: "pending",
        shipping_method,
        shipping_fee,
        shipping_status: "pending",
        shipping_address,
        receiver_name,
        receiver_phone
      }], { session });

      const order = newOrder[0];

      // 5. tạo order items
      for (const oi of orderItemsData) {
        await OrderItem.create([{
          order_id: order._id,
          product_variant_id: oi.product_variant_id,
          quantity: oi.quantity,
          price: oi.price
        }], { session });
      }

      // 6. xóa cart items và cart (hoặc giữ cart)
      await CartItem.deleteMany({ cart_id: cartId }).session(session);
      await Cart.findByIdAndDelete(cartId).session(session);

      await session.commitTransaction();
      session.endSession();

      // return order + items
      const createdOrder = await Order.findById(order._id).lean();
      return createdOrder;
    } catch (err) {
      await session.abortTransaction().catch(()=>{});
      session.endSession();
      throw err;
    }
  }

  async getOrdersByUser(userId: string) {
    return Order.find({ user_id: userId }).sort({ created_at: -1 });
  }

  async getOrderById(orderId: string) {
    return Order.findById(orderId);
  }

  async updateShippingStatus(orderId: string, status: string, note?: string) {
    const order = await Order.findById(orderId);
    if (!order) throw createError.NotFound("Order not found");
    order.shipping_status = status;
    await order.save();

    // create shipping log
    await (await import("../models/ShippingLog")).default.create({
      order_id: order._id,
      status,
      note
    });

    return order;
  }

  async createPayment(orderId: string, amount: number, method: string, transaction_id?: string) {
    const payment = await (await import("../models/Payment")).default.create({
      order_id: orderId,
      amount,
      method,
      status: method === "cod" ? "pending" : "pending",
      transaction_id
    });

    // nếu instant payment success you can set order.payment_status = 'paid'
    if (method === "paypal") {
      // example flow: call paypal SDK, verify, then set payment.status = success
    }

    return payment;
  }
}

export default new OrderService();
