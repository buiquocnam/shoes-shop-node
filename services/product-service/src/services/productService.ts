import Product from "../models/Product";
import createError from "http-errors";
import { ProductDTO } from "../types/product.types";

export class productService {
    async createProduct(productData: ProductDTO) {
        try {   
            const { name, price, categoryId, brandId, description } = productData;
            const existingProduct = await
                Product.findOne({ name: name.toLowerCase() });
            if (existingProduct) {
                throw createError.Conflict("Product with this name already exists");
            }
            const newProduct = new Product({
                name: name.toLowerCase(),
                price,
                categoryId,
                brandId,
                description,
            });
            await newProduct.save();
            return newProduct;
        }   
        catch (err: any) {
            throw createError(err.status || 500, err.message || "Create product failed");
        }
    }

    async getProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get products failed");
        }
    }
    
    async getProductById(productId: string) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw createError.NotFound("Product not found");
            }
            return product;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get product failed");
        }   
    }

    async updateProduct(productId: string, productData: Partial<ProductDTO>) {
        try {
            const product = await Product.findByIdAndUpdate(    
                productId,  
                { $set: productData },
                { new: true }
            );
            if (!product) {
                throw createError.NotFound("Product not found");
            }
            return product;
        }
        catch (err: any) {
            throw createError(err.status || 500, err.message || "Update product failed");
        }
    }

    async deleteProduct(productId: string) {    
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                throw createError.NotFound("Product not found");
            }
            return product;
        }   
        catch (err: any) {
            throw createError(err.status || 500, err.message || "Delete product failed");
        }
    }
}

export default new productService();