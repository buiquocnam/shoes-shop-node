import ProductImage from "../models/ProductImage";
import createError from "http-errors";
import { ProductImageDTO } from "../types/product.types";

export class productImageService {
    async uploadProductImage(data: any) {
        try {
            const newImage = new ProductImage({
                product_id: data.product_id,
                image_url: data.image_url,  
                isPrimary: data.isPrimary || false,
            });

            await newImage.save();
            return newImage;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Add product image failed");
        }
    }

    async getProductImages(product_id: string) {
        try {
            const images = await ProductImage.find({ product_id });
            return images;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get product images failed");
        }
    }

    async deleteProductImage(imageId: string) {
        try {
            const image = await ProductImage.findByIdAndDelete(imageId);
            if (!image) {
                throw createError.NotFound("Product image not found");
            }   
            return image;
        }
        catch (err: any) {
            throw createError(err.status || 500, err.message || "Delete product image failed");
        }
    }
};

export default new productImageService();