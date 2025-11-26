// services/product-service/src/middleware/authenticate.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token received:', token);

  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  console.log('Verified payload:', payload);

  req.user = payload;
  next();
} catch (error) {
  console.error('Authenticate error:', error);
  return res.status(401).json({ message: 'Invalid or expired token' });
}

};