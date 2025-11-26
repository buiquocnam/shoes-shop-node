import { Request, Response } from 'express';
import prisma from '../prisma';

export const getOrderItems = async (req: Request, res: Response) => {
  try {
    const orderItems = await prisma.orderItem.findMany();
    res.json({ orderItems });
    } catch (err: any) {
    res.status(500).json({ error: err.message });   
    }
};

export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity, price } = req.body;
    const updatedItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { quantity, price }
    });
    res.json(updatedItem);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    }
};

export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    await prisma.orderItem.delete({
        where: { id: itemId }
    });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    }
};

export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const { orderId, productVariantId, quantity, price } = req.body;
    const orderItem = await prisma.orderItem.create({
        data: { orderId, productVariantId, quantity, price }
    });
    res.status(201).json(orderItem);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    }   
};

export const getOrderItemsByOrderId = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;  
    const orderItems = await prisma.orderItem.findMany({
        where: { orderId: itemId }
    });
    res.json({ orderItems });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    }   
};
