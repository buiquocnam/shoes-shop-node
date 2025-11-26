import { Request, Response } from 'express';
import prisma from '../prisma';

export const listOrders = (req: Request, res: Response) => {
  res.json({ orders: [] });
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true } // lấy luôn items
    });
    res.json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, shippingAddress, shippingMethod, receiverName, receiverPhone, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least 1 item" });
    }

    // Tổng tiền
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        shippingAddress,
        shippingMethod,
        receiverName,
        receiverPhone,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderDetail = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payments: true,
        shippingLogs: true
      }
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, transactionId } = req.body;

    const payment = await prisma.payment.updateMany({
      where: { orderId },
      data: { status, transactionId }
    });

    res.json({ message: "Payment updated", payment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateShippingStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { shippingStatus, trackingCode } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { shippingStatus, trackingCode }
    });

    res.json({ message: "Shipping updated", order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addShippingLog = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const log = await prisma.shippingLog.create({
      data: {
        orderId,
        status,
        note
      }
    });

    res.json(log);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default listOrders;
