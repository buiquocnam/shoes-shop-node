import { Router } from 'express';
import {  getOrder, createOrder, getOrdersByUser, getOrderDetail, updatePaymentStatus, updateShippingStatus, addShippingLog} from '../controllers/orderController';
import { getOrderItems, updateOrderItem, deleteOrderItem, createOrderItem, getOrderItemsByOrderId } from '../controllers/orderItemController';
import { get } from 'http';

const router = Router();

router.get('/list', (req, res) => {
  res.json({ orders: [] });
});
 
router.post("/orders", createOrder);
router.get("/orders", getOrder);
router.get("/orders/user/:userId", getOrdersByUser);
router.get("/orders/:orderId", getOrderDetail);
router.patch("/orders/:orderId/payment", updatePaymentStatus);
router.patch("/orders/:orderId/shipping", updateShippingStatus);
router.post("/orders/:orderId/shipping-log", addShippingLog);

router.get("/orderItems", getOrderItems);
router.get("/orderItems/:itemId", getOrderItemsByOrderId);
router.patch("/orderItems/:itemId", updateOrderItem);
router.delete("/orderItems/:itemId", deleteOrderItem);
router.post("/oderItems", createOrderItem);

export default router;
