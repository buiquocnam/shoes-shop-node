import ProductVariant from "../models/ProductVariant";
import createError from "http-errors";
import { ProductVariantDTO } from "../types/product.types";

export class productVariantService {    
    async createProductVariant(variantData: ProductVariantDTO) {
        try {
            const { product_id, color, sizeId, stock } = variantData;
            const newVariant = new ProductVariant({   
                product_id, color, sizeId, stock,
            });
            await newVariant.save();
            return newVariant;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Create product variant failed");
        }
    }

    async getProductVariants(product_id: string) {
        try {
            const variants = await ProductVariant.find({ product_id });
            return variants;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get product variants failed");
        }
    }

    async deleteProductVariant(variantId: string) {
        try {
            const variant = await ProductVariant.findByIdAndDelete(variantId);
            if (!variant) {
                throw createError.NotFound("Product variant not found");
            }
            return variant;
        }   
        catch (err: any) {
            throw createError(err.status || 500, err.message || "Delete product variant failed");
        }
    }
}
export default new productVariantService();