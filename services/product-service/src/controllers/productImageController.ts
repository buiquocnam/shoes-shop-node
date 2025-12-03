import { Request, Response, NextFunction } from 'express';
import productImageService from '../services/productImageService';
import { uploadToMinio } from '../utils/uploadMinio';

export const uploadProductImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const file = req.file;
        const { product_id, isPrimary } = req.body;

        if (!file) return res.status(400).json({ message: "No image uploaded" });

        // Upload file lên MinIO
        const image_url = await uploadToMinio(file);  // phải là image_url

        // Gọi service
        const result = await productImageService.uploadProductImage({
            product_id,
            image_url,                 // truyền đúng tên field
            isPrimary: isPrimary === "true",
        });

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const getProductImages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const productId = req.params.productId;
        const result = await productImageService.getProductImages(productId);
        res.json(result);
    }
    catch (err) {
        next(err);
    }   
};

export const deleteProductImage = async (
    req: Request,
    res: Response,  
    next: NextFunction  
) => {
    try {
        const imageId = req.params.id;
        const result = await productImageService.deleteProductImage(imageId);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

