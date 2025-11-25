import { Router } from 'express';
import {  getOrder, createOrder, getOrdersByUser, getOrderDetail, updatePaymentStatus, updateShippingStatus, addShippingLog} from '../controllers/orderController';
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

export default router;
