import Brand from "../models/Brand";
import createError from "http-errors";
import { CreateBrandDTO } from "../types/product.types";

export class brandService {
    async createBrand(brandData: CreateBrandDTO) {
        try {
            const { name, logo } = brandData;
            const existingBrand = await
                Brand.findOne({ name: name.toLowerCase() });

            if (existingBrand) {
                throw createError.Conflict("Brand with this name already exists");
            }

            const newBrand = new Brand({
                name: name.toLowerCase(),
                logo,    
            });

            await newBrand.save();
            return newBrand;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Create brand failed");
        }   
    }

    async getBrands() {
        try {
            const brands = await Brand.find();
            return brands;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get brands failed");
        }   
    }

    async getBrandById(brandId: string) {
        try {
            const brand = await Brand.findById(brandId);
            if (!brand) {
                throw createError.NotFound("Brand not found");
            }
            return brand;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get brand failed");
        }
    }

    async updateBrand(brandId: string, brandData: Partial<CreateBrandDTO>) {
        try {
            const brand = await Brand.findByIdAndUpdate( 
                brandId,
                { $set: brandData },
                { new: true }
            );
            if (!brand) {
                throw createError.NotFound("Brand not found");
            }
            return brand;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Update brand failed");
        }
    }
    
    async deleteBrand(brandId: string) {
        try {
            const brand = await Brand.findByIdAndDelete(brandId);
            if (!brand) {
                throw createError.NotFound("Brand not found");
            }
            return brand;
        }
        catch (err: any) {
            throw createError(err.status || 500, err.message || "Delete brand failed");
        }   
    }

}
export default new brandService();
