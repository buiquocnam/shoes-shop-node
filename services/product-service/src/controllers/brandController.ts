import { Request, Response, NextFunction } from 'express';
import brandService from '../services/brandService';
import { CreateBrandDTO, UpdateBrandDTO } from '../types/product.types';

export const createBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const brandData: CreateBrandDTO = req.body;
        const result = await brandService.createBrand(brandData);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const getBrands = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await brandService.getBrands();
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const getBrandById = async ( 
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const brandId = req.params.id;
        const result = await brandService.getBrandById(brandId);
        res.json(result);
    }
    catch (err) {
        next(err);
    }   
};

export const updateBrand = async (      
    req: Request,
    res: Response,
    next: NextFunction  
) => {
    try {
        const brandId = req.params.id;
        const brandData: UpdateBrandDTO = req.body;
        const result = await brandService.updateBrand(brandId, brandData);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteBrand = async (
    req: Request,
    res: Response,  
    next: NextFunction
) => {
    try {   
        const brandId = req.params.id;
        await brandService.deleteBrand(brandId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

