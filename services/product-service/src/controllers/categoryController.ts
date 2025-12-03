import { Request, Response, NextFunction } from 'express';
import brandService from '../services/brandService';
import { CreateCategoryDTO } from '../types/product.types';

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryData: CreateCategoryDTO = req.body;
        const result = await brandService.createBrand(categoryData);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }   
};

export const getCategories = async (    
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await brandService.getBrands();
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

export const getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryId = req.params.id;
        const result = await brandService.getBrandById(categoryId);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryId = req.params.id;
        const result = await brandService.deleteBrand(categoryId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

