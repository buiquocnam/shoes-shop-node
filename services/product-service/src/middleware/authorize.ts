// services/product-service/src/middleware/authorize.ts
// ĐÃ SỬA HOÀN HẢO: fix lỗi TypeScript + hoạt động với token mới có "role": "ADMIN"

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Định nghĩa kiểu payload rõ ràng để TypeScript không kêu
interface JwtPayloadCustom {
  userId: string;
  email: string;
  roleId: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface AuthRequest extends Request {
  user?: JwtPayloadCustom;
}

// ID ADMIN cố định
const ADMIN_ROLE_ID = '00000000-0000-0000-0000-000000000001';
const SUPER_ADMIN_ROLE_ID = '00000000-0000-0000-0000-000000000002';

// Middleware dùng roleId (dự phòng) – không cần nữa nhưng giữ lại cho chắc
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.decode(token) as JwtPayloadCustom | null;

    if (!payload) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('Token payload:', payload);

    const roleId = payload.roleId;
    if (!roleId || (roleId !== ADMIN_ROLE_ID && roleId !== SUPER_ADMIN_ROLE_ID)) {
      return res.status(403).json({ message: 'Admin only' });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// HÀM CHÍNH ĐANG DÙNG TRONG ROUTE – ĐÃ FIX LỖI TypeScript + dùng "role" từ token mới
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userRole = req.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Forbidden. Required roles: ${allowedRoles.join(', ')}. Your role: ${userRole || 'none'}` 
      });
    }

    next();
  };
};
