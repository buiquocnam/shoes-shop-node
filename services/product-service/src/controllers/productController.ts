// src/services/product-service/src/controllers/product.controller.ts

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma'; // ← đúng đường dẫn bạn đang có
import slugify from 'slugify';
import jwt, { JwtPayload } from 'jsonwebtoken'; // ← sửa lỗi đỏ này

// ─────────────────────────────────────────────────────────────
// Mở rộng Request để có user từ token (middleware verify gán req.user)
// ─────────────────────────────────────────────────────────────
interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

// ─────────────────────────────────────────────────────────────
// Middleware kiểm tra ADMIN (dùng chung)
// ─────────────────────────────────────────────────────────────
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  const payload = typeof req.user === 'string' ? jwt.decode(req.user) : req.user;
  const role = (payload as JwtPayload)?.role;

  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admin role required' });
  }
  next();
};

// ─────────────────────────────────────────────────────────────
// Helper: chuẩn hóa slug
// ─────────────────────────────────────────────────────────────
const normalizeSlug = (text: string): string => {
  return slugify(text, { lower: true, strict: true, trim: true });
};

// ─────────────────────────────────────────────────────────────
// PRODUCT CONTROLLERS
// ─────────────────────────────────────────────────────────────
export const listProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        variants: true,
        brand: { select: { name: true } },
        category: { include: { parent: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: products });
  } catch (err: any) {
    console.error('List products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // UUID string

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        brand: { select: { id: true, name: true, logo: true } },
        category: {
          include: {
            parent: { select: { id: true, name: true } },
            children: { select: { id: true, name: true } },
          },
        },
        // SỬA LỖI TẠI ĐÂY: không có relation "user" trong Review
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            userId: true,   // chỉ lấy userId thôi
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err: any) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Chỉ ADMIN mới được tạo
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description, price, discount, stock, status = 'active', brandId, categoryId, images, variants } = req.body;

    if (!name?.trim() || !slug?.trim() || price == null) {
      return res.status(400).json({ message: 'Thiếu name, slug hoặc price' });
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) return res.status(400).json({ message: 'Price không hợp lệ' });

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slugify(slug, { lower: true, strict: true }),
        description: description?.trim() || null,
        price: priceNum,
        discount: discount != null ? Number(discount) : null,
        stock: stock != null ? Number(stock) : null,
        status: status === 'inactive' ? 'inactive' : 'active',
        brandId,
        categoryId,
      },
    });

    console.log("PRODUCT ĐÃ TẠO:", product.id);
    console.log("IMAGES NHẬN ĐƯỢC:", req.body.images);
    console.log("VARIANTS NHẬN ĐƯỢC:", req.body.variants);

    // TẠO IMAGES – BÂY GIỜ SẼ CHẠY!!!
    if (Array.isArray(images) && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img: any) => ({
          productId: product.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary ?? false,
        })),
      });
    }

    // TẠO VARIANTS – BÂY GIỜ SẼ CHẠY!!!
    if (Array.isArray(variants) && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((v: any) => ({
          productId: product.id,
          color: v.color,
          sizeId: v.sizeId,
          stock: v.stock ?? 0,
        })),
      });
    }

    // Trả về product đầy đủ (tùy chọn)
    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true, variants: { include: { size: true } } },
    });

    return res.status(201).json({
      message: 'Tạo sản phẩm thành công!',
      data: fullProduct || product,
    });
  } catch (err: any) {
    console.error('Lỗi tạo product:', err);
    if (err.code === 'P2002') return res.status(409).json({ message: 'Slug đã tồn tại' });
    if (err.code === 'P2003') return res.status(400).json({ message: 'brandId hoặc categoryId không hợp lệ' });
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// BRAND CONTROLLERS (chỉ ADMIN)
// ─────────────────────────────────────────────────────────────
export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, logo } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        logo: logo?.trim() || null,
      },
    });

    return res.status(201).json({
      message: 'Brand created successfully',
      data: brand,
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Brand name already exists' });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const listBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: brands });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};