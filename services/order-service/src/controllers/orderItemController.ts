import { Router, Request, Response, NextFunction } from "express";
import OrderItemService from "../services/orderItemService";
import createError from "http-errors";

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string };
}

/**
 * POST /order-items - Create a new order item
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, product_variant_id, quantity, price } = req.body;

    if (!order_id || !product_variant_id || !quantity || price === undefined) {
      return res.status(400).json({
        message: "order_id, product_variant_id, quantity, and price are required",
      });
    }

    const item = await OrderItemService.createOrderItem(order_id, product_variant_id, quantity, price);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /order-items/batch - Create multiple order items
 */
router.post("/batch", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, items } = req.body;

    if (!order_id || !items) {
      return res.status(400).json({
        message: "order_id and items array are required",
      });
    }

    const createdItems = await OrderItemService.createBatchOrderItems(order_id, items);
    res.status(201).json(createdItems);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /order-items/:id - Get order item by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await OrderItemService.getOrderItemById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /order-items/order/:orderId - Get all items for an order
 */
router.get("/order/:orderId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await OrderItemService.getOrderItemsByOrderId(req.params.orderId);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /order-items/:id - Update order item
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity, price } = req.body;

    const item = await OrderItemService.updateOrderItem(req.params.id, quantity, price);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /order-items/:id - Delete order item
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await OrderItemService.deleteOrderItem(req.params.id);
    res.json({ message: "Order item deleted", item });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /order-items - Get all order items (admin only)
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await OrderItemService.getAllOrderItems(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /order-items/user/:userId - Get all order items for a user
 */
router.get("/user/:userId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await OrderItemService.getUserOrderItems(req.params.userId);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

export default router;
