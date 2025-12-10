import { Router, Response, NextFunction, Request } from "express";
import { AuthRequest } from "../types/AuthRequest";
import orderService from "../services/orderService";
import createError from "http-errors";

const router = Router();

/**
 * POST /orders - Create order from cart
 */
router.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { cartId, shipping_address, receiver_name, receiver_phone, payment_method, shipping_method } = req.body;

    if (!cartId || !shipping_address) {
      return res.status(400).json({ message: "cartId and shipping_address required" });
    }

    const order = await orderService.createOrderFromCart({
      userId,
      cartId,
      shipping_address,
      receiver_name,
      receiver_phone,
      payment_method,
      shipping_method,
    });

    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /orders/my-orders - Get user's orders
 */
router.get("/my-orders", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orders = await orderService.getOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /orders/:id - Get order by ID
 */
router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /orders/:id/shipping - Update order shipping status
 */
router.put("/:id/shipping", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const updated = await orderService.updateShippingStatus(orderId, status, note);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /orders/:id/payment - Create payment for order
 */
router.post("/:id/payment", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, method, transaction_id } = req.body;

    if (!amount || !method) {
      return res.status(400).json({ message: "amount and method are required" });
    }

    const payment = await orderService.createPayment(req.params.id, amount, method, transaction_id);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /orders - Get all orders (admin only)
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    // Note: Implement getAllOrders method in orderService if needed for admin panel
    res.status(501).json({ message: "Admin get all orders not implemented yet" });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /orders/:id/cancel - Cancel order
 */
router.put("/:id/cancel", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update status to cancelled
    const updated = await orderService.updateShippingStatus(orderId, "cancelled", "Cancelled by user");
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
