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

export const getProductVariants = async (
    req: Request,
    res: Response,  
    next: NextFunction
) => {
    try {
        const productId = req.params.productId;
        const result = await productVariant.getProductVariants(productId);
        res.json(result);
    }
    catch (err) {
        next(err);
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

