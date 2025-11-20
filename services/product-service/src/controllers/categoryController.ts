// services/product-service/src/controllers/categoryController.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    roleId: string;
    role: string;  // ← BẮT BUỘC PHẢI CÓ ĐỂ CHECK ADMIN
  };
}

// Dùng hàm authorize từ middleware (đã được fix hoàn hảo)
import { authorize } from '../middleware/authorize';

// HOẶC nếu bạn vẫn muốn dùng inline – thì sửa như này (mình khuyên dùng authorize từ middleware)
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

// TỐT NHẤT: DÙNG AUTHORIZE TỪ MIDDLEWARE (đã fix lỗi TS + hoạt động hoàn hảo)
export const createCategory = async (req: Request, res: Response) => {
  // Dùng middleware authorize đã fix – chỉ cần thêm vào route là đủ
  // Không cần requireAdmin inline nữa!
  try {
    const { name, description, parentId } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
    }

    const data: any = {
      name: name.trim(),
      description: description?.trim() || null,
    };

    if (parentId !== undefined) {
      data.parentId = parentId === null ? null : String(parentId);
    }

    const category = await prisma.category.create({ data });

    res.status(201).json({
      message: 'Tạo danh mục thành công!',
      data: category,
    });
  } catch (err: any) {
    console.error('Create category error:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Tên danh mục đã tồn tại' });
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ message: 'parentId không hợp lệ' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// PUBLIC - GET ALL
export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: { select: { id: true, name: true } },
        children: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};