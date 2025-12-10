import { Router, Request, Response, NextFunction } from "express";
import ShippingLogService from "../services/shippingLogService";
import createError from "http-errors";

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string };
}

/**
 * POST /shipping-logs - Create a new shipping log entry
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, status, note } = req.body;

    if (!order_id || !status) {
      return res.status(400).json({
        message: "order_id and status are required",
      });
    }

    const log = await ShippingLogService.createShippingLog(order_id, status, note);
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /shipping-logs/:id - Get shipping log by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const log = await ShippingLogService.getShippingLogById(req.params.id);
    res.json(log);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /shipping-logs/order/:orderId - Get all shipping logs for an order
 */
router.get("/order/:orderId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await ShippingLogService.getShippingLogsByOrderId(req.params.orderId);
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /shipping-logs/:id - Update shipping log note
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { note } = req.body;

    const log = await ShippingLogService.updateShippingLog(req.params.id, note);
    res.json(log);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /shipping-logs/:id - Delete shipping log
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const log = await ShippingLogService.deleteShippingLog(req.params.id);
    res.json({ message: "Shipping log deleted", log });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /shipping-logs - Get all shipping logs (admin only)
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await ShippingLogService.getAllShippingLogs(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /shipping-logs/user/:userId - Get shipping history for a user
 */
router.get("/user/:userId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;

    // Check if user is requesting their own shipping history or is admin
    if (req.user?.id !== userId && !req.query.admin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const logs = await ShippingLogService.getUserShippingHistory(userId);
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /shipping-logs/track/:trackingCode - Track order by tracking code
 */
router.post("/track/:trackingCode", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ShippingLogService.trackOrder(req.params.trackingCode);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
