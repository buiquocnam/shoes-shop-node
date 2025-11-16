import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, variants: true, brand: true, category: true }
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
      include: { images: true, variants: true, brand: true, category: true }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, discount, stock, status, brandId, categoryId } = req.body;
    if (!name || !slug || price == null) return res.status(400).json({ message: 'Missing required fields' });

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        discount: discount ? Number(discount) : 0,
        stock: stock ? Number(stock) : 0,
        status: status || 'active',
        brandId: brandId ? Number(brandId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined
      }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parentId } = req.body;
    if (!name) return res.status(400).json({ message: 'Missing name' });
    const category = await prisma.category.create({
      data: { name, description, parentId: parentId ? Number(parentId) : undefined }
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

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
    const brand = await prisma.brand.create({ data: { name, logo } });
    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
