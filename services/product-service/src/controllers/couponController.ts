import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const listCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: coupons });
  } catch (err: any) {
    console.error('List coupons error:', err);
    res.status(500).json({ message: 'Server error' });
  } 
};

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // UUID string           
    const coupon = await prisma.coupon.findUnique({
        where: { id },
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }   
    res.json({ success: true, data: coupon });
    } catch (err: any) {
        console.error('Get coupon error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      discountPercent,     // tên đúng trong model: discountPercent (không phải discountPercentage)
      minOrder,            // giá trị đơn hàng tối thiểu
      expiredAt,           // tên đúng trong model: expiredAt (không phải expirationDate)
    } = req.body;

    // === VALIDATION ===
    if (!code?.trim()) {
      return res.status(400).json({ message: 'Mã coupon là bắt buộc' });
    }

    if (discountPercent == null || discountPercent < 1 || discountPercent > 100) {
      return res.status(400).json({ message: 'discountPercent phải từ 1 đến 100' });
    }

    if (minOrder != null && (isNaN(Number(minOrder)) || Number(minOrder) < 0)) {
      return res.status(400).json({ message: 'minOrder phải là số >= 0' });
    }

    if (expiredAt && isNaN(Date.parse(expiredAt))) {
      return res.status(400).json({ message: 'expiredAt không đúng định dạng ngày' });
    }

    // === TẠO COUPON ===
    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),           // chuẩn hóa: luôn in hoa
        discountPercent: Number(discountPercent),  // Prisma yêu cầu Int
        minOrder: minOrder ? Number(minOrder) : null,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo coupon thành công!',
      data: coupon,
    });
  } catch (err: any) {
    console.error('Lỗi tạo coupon:', err);

    // Slug/code đã tồn tại
    if (err.code === 'P2002' && err.meta?.target?.includes('code')) {
      return res.status(409).json({ message: 'Mã coupon đã tồn tại!' });
    }

    // Các lỗi khác
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo coupon',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // UUID string
        const coupon = await prisma.coupon.findUnique({
            where: { id },
        });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        await prisma.coupon.delete({
            where: { id },
        });
        res.json({ message: 'Coupon deleted successfully' });
    } catch (err: any) {
        console.error('Delete coupon error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};  
