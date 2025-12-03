import Size from "../models/Size";
import createError from "http-errors";
import { SizeDTO } from "../types/product.types";

export class sizeService {
    async createSize(sizeData: SizeDTO) {
    try {
        const { sizeLabel } = sizeData;

        if (sizeLabel === undefined || sizeLabel === null) {
            throw createError.BadRequest("sizeLabel is required");
        }

        const existingSize = await Size.findOne({ sizeLabel });
        if (existingSize) {
            throw createError.Conflict("This size already exists");
        }

        const newSize = new Size({ sizeLabel });
        await newSize.save();
        return newSize;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Create size failed");
        }
    }


    async getSizes() {
        try {
            const sizes = await Size.find();
            return sizes;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get sizes failed");
        }
    }

    async getSizeById(sizeId: string) {
        try {
            const size = await Size.findById(sizeId);
            if (!size) {
                throw createError.NotFound("Size not found");
            }
            return size;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get size failed");
        }
    }

    async deleteSize(sizeId: string) {  
        try {
            const size = await Size.findByIdAndDelete(sizeId);
            if (!size) {
                throw createError.NotFound("Size not found");
            }
            return size;
        }   
        catch (err: any) {
            throw createError(err.status || 500, err.message || "Delete size failed");
        }   
    }
}
export default new sizeService();