import Category from "../models/Category";
import createError from "http-errors";
import { CreateCategoryDTO } from "../types/product.types";

export class categoryService {
    async createCategory(categoryData: CreateCategoryDTO) {
        try {
            const { name, description } = categoryData;
            const existingCategory = await
                Category.findOne({ name: name.toLowerCase() });
            if (existingCategory) {
                throw createError.Conflict("Category with this name already exists");
            }
            const newCategory = new Category({
                name: name.toLowerCase(),
                description,
            });

            await newCategory.save();
            return newCategory;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Create category failed");
        }
    }

    async getCategories() {
        try {
            const categories = await Category.find();
            return categories;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get categories failed");
        }
    }

    async getCategoryById(categoryId: string) {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw createError.NotFound("Category not found");
            }       
            return category;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get category failed");
        }
    }

    async deleteCategory(categoryId: string) {
        try {
            const category = await Category.findByIdAndDelete(categoryId);
            if (!category) {
                throw createError.NotFound("Category not found");
            }
            return category;
        }   
        catch (err: any) {
            throw createError(err.status || 500, err.message || "Delete category failed");
        }
    }
}   

export default new categoryService();