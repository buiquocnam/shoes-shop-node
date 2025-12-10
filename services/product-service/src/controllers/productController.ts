import e, { Request, Response, NextFunction } from "express";
import { ProductDTO } from "../types/product.types";
import productService from "../services/productService";

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const productData: ProductDTO = req.body;
        const result = await productService.createProduct(productData);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const getProducts = async (  
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await productService.getProducts();
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

export const getProductById = async (
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const productId = req.params.id;
        const result = await productService.getProductById(productId);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const productId = req.params.id;
        const result = await productService.deleteProduct(productId);
        res.json(result);
    }
    catch (err) {
        next(err);
    }   

};

export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction  
) => {
    try {
        const productId = req.params.id;
        const productData: ProductDTO = req.body;
        const result = await productService.updateProduct(productId, productData);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};



