import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hàm hỗ trợ tạo slug (Dùng cho cả Product và Category)
const slugify = (text: string) => {
    // Loại bỏ ký tự đặc biệt, chuyển thành chữ thường và thay khoảng trắng bằng dấu gạch ngang
    return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
};

// --- PRODUCT CRUD ---

export const listProducts = async (_req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: { 
                images: true, 
                variants: true, 
                brand: true, 
                // Bao gồm cả quan hệ cha-con của category (nếu có)
                category: { include: { parent: true } } 
            }
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const product = await prisma.product.findUnique({
            where: { id },
            include: { 
                images: true, 
                variants: true, 
                brand: true, 
                category: { include: { parent: true } } 
            }
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { 
            name, slug, description, price, discount, stock, status, 
            brandId, categoryId 
        } = req.body;

        if (!name || !slug || price == null) {
            return res.status(400).json({ message: 'Missing required fields: name, slug, price' });
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug: slugify(slug), // Đảm bảo slug được chuẩn hóa
                description: description || null, // Có thể null
                price: Number(price),
                discount: discount ? Number(discount) : 0,
                stock: stock ? Number(stock) : 0,
                status: status || 'active',
                
                // 💡 SỬA LỖI: Sử dụng NULL thay vì UNDEFINED cho Int?
                brandId: brandId ? Number(brandId) : null,
                categoryId: categoryId ? Number(categoryId) : null
            }
        });
        res.status(201).json(product);
    } catch (err: any) {
        if (err.code === 'P2002') {
             return res.status(409).json({ message: 'Product slug already exists.' });
        }
        res.status(500).json({ error: (err as Error).message });
    }
};


// --- BRAND CRUD ---

export const listBrands = async (_req: Request, res: Response) => {
    try {
        const brands = await prisma.brand.findMany();
        res.json(brands);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const createBrand = async (req: Request, res: Response) => {
    try {
        const { name, logo } = req.body;
        if (!name) return res.status(400).json({ message: 'Missing name' });
        
        const brand = await prisma.brand.create({ 
            data: { 
                name, 
                logo: logo || null // logo là String? nên cho phép null
            } 
        });
        res.status(201).json(brand);
    } catch (err: any) {
        if (err.code === 'P2002') {
             return res.status(409).json({ message: 'Brand name already exists.' });
        }
        res.status(500).json({ error: (err as Error).message });
    }
};