import { Router } from "express";
import { upload } from "../middlewares/upload";
import authMiddleware from "../middlewares/authMiddleware";
import orderController from "../controllers/orderController";
import cartController from "../controllers/cartController";
import cartItemController from "../controllers/cartItemController";
import paymentController from "../controllers/paymentController";
import orderItemController from "../controllers/orderItemController";
import shippingLogController from "../controllers/shippingLogController";

const router = Router();

/**
 * Order Routes
 */
router.use("/orders", authMiddleware, orderController);

/**
 * Cart Routes
 */
router.use("/carts", authMiddleware, cartController);

/**
 * Cart Item Routes
 */
router.use("/cart-items", authMiddleware, cartItemController);

/**
 * Payment Routes
 */
router.use("/payments", paymentController);

/**
 * Order Item Routes
 */
router.use("/order-items", orderItemController);

/**
 * Shipping Log Routes
 */
router.use("/shipping-logs", shippingLogController);

export default router;
