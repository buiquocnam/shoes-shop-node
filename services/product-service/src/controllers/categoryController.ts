import { Request, Response } from 'express';
// ⚠️ Đảm bảo file này tồn tại và export default prisma
import prisma from '../prisma'; 

// Hàm hỗ trợ tạo slug (Bắt buộc phải có để tránh lỗi slug: slugify(name) )
const slugify = (text: string) => {
    return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
};

// ----------------------------------------------------------------------
// 1. TẠO CATEGORY (POST)
// ----------------------------------------------------------------------
export const createCategory = async (req: Request, res: Response) => {
    const { 
        name, 
        description, 
        parentId 
        // Loại bỏ các trường không tồn tại trong DB hiện tại (isActive, order, imageUrl)
    } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }
    
    try {
        const category = await prisma.category.create({
            data: {
                name,
                // description là String? (nullable)
                description: description || null, 
                // slug là bắt buộc và phải có
                slug: slugify(name),
                
                // 💡 Khắc phục lỗi TypeScript/Prisma: Int? phải là Number hoặc NULL
                parentId: parentId ? Number(parentId) : null,
            },
        });
        return res.status(201).json(category);
    } catch (error: any) {
        if (error.code === 'P2002') { // Lỗi unique constraint (Tên/Slug đã tồn tại)
            return res.status(409).json({ message: 'Category name or slug already exists.' });
        }
        console.error("Error creating category:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// ----------------------------------------------------------------------
// 2. ĐỌC TẤT CẢ CATEGORY (GET ALL)
// ----------------------------------------------------------------------
export const listCategories = async (req: Request, res: Response) => {
    try {
        // Tối ưu: Lấy cả quan hệ cha-con cho hiển thị cây
        const categories = await prisma.category.findMany({
             include: { children: true, parent: true },
             // ❌ Loại bỏ orderBy: { order: 'asc' } vì trường 'order' không tồn tại
        });
        return res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
