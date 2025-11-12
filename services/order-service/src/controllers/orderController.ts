import { Request, Response } from 'express';

export const listOrders = (req: Request, res: Response) => {
  res.json({ orders: [] });
};

export default listOrders;
