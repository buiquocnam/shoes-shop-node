// src/controllers/reviewController.ts
import { Request, Response } from 'express';
import { prisma } from '../prisma';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
    email?: string;
  };
}

// ==================== DANH SÁCH TẤT CẢ ĐÁNH GIÁ ====================
export const listReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        userId: true,
        productId: true,
      },
    });

    return res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err: any) {
    console.error('List reviews error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ==================== LẤY ĐÁNH GIÁ THEO SẢN PHẨM ====================
export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Thiếu productId' });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        userId: true,
        productId: true,
      },
    });

    return res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err: any) {
    console.error('Get reviews by product error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ==================== TẠO ĐÁNH GIÁ MỚI ====================
export const createReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    const { productId, rating, comment } = req.body;

    if (!productId || rating == null) {
      return res.status(400).json({ success: false, message: 'Thiếu productId hoặc rating' });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating phải từ 1 đến 5' });
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!productExists) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: ratingNum,
        comment: comment?.trim() || null,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        userId: true,
        productId: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Đánh giá thành công!',
      data: review,
    });
  } catch (err: any) {
    console.error('Create review error:', err);
    if (err.code === 'P2003') {
      return res.status(400).json({ success: false, message: 'User hoặc sản phẩm không tồn tại' });
    }
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ==================== CẬP NHẬT ĐÁNH GIÁ ====================
export const updateReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({
      where: { id },
      select: { id: true, userId: true, rating: true },
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
    }

    if (userRole !== 'ADMIN' && review.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền sửa đánh giá này' });
    }

    const ratingNum = rating != null ? Number(rating) : review.rating;
    if (rating != null && (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)) {
      return res.status(400).json({ success: false, message: 'Rating phải từ 1 đến 5' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        rating: ratingNum,
        comment: comment !== undefined ? (comment?.trim() || null) : undefined,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        userId: true,
        productId: true,
      },
    });

    return res.json({
      success: true,
      message: 'Cập nhật đánh giá thành công!',
      data: updated,
    });
  } catch (err: any) {
    console.error('Update review error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ==================== XÓA ĐÁNH GIÁ ====================
export const deleteReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await prisma.review.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
    }

    if (userRole !== 'ADMIN' && review.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa đánh giá này' });
    }

    await prisma.review.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Xóa đánh giá thành công!',
    });
  } catch (err: any) {
    console.error('Delete review error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};