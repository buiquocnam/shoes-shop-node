import { Router, Request, Response, NextFunction } from "express";
import paymentService from "../services/paymentService";
import createError from "http-errors";

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string };
}

/**
 * POST /payments - Create a new payment
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, amount, method, transaction_id } = req.body;

    if (!order_id || !amount || !method) {
      return res.status(400).json({ message: "order_id, amount, and method are required" });
    }

    const payment = await paymentService.createPayment(order_id, amount, method, transaction_id);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /payments/:id - Get payment by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /payments/order/:orderId - Get payments by order ID
 */
router.get("/order/:orderId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await paymentService.getPaymentsByOrderId(req.params.orderId);
    res.json(payments);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /payments/:id/status - Update payment status
 */
router.put("/:id/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const payment = await paymentService.updatePaymentStatus(req.params.id, status);
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /payments - Get all payments (admin only)
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await paymentService.getAllPayments(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /payments/:id - Delete payment
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.deletePayment(req.params.id);
    res.json({ message: "Payment deleted", payment });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /payments/:id/verify - Verify payment
 */
router.post("/:id/verify", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "transactionId is required" });
    }

    const payment = await paymentService.verifyPayment(req.params.id, transactionId);
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

export default router;
