import { Request, Response, NextFunction } from 'express';
import productVariant from '../services/productVariant';
import { ProductVariantDTO } from '../types/product.types';

export const createProductVariant = async (
    req: Request,
    res: Response,  
    next: NextFunction
) => {
    try {
        const variantData: ProductVariantDTO = req.body;
        const result = await productVariant.createProductVariant(variantData);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
};

export const getProductVariantById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const variant_id = req.params.variant_id; // đúng tên params
        const result = await productVariant.getProductVariantById(variant_id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteProductVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const variantId = req.params.id;
        const result = await productVariant.deleteProductVariant(variantId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

