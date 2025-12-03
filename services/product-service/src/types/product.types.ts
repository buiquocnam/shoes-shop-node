// src/types/product.types.ts

import { Types } from "mongoose";

export interface CreateBrandDTO {
  name: string;
  logo?: string;
  createdAt?: Date;
}

export interface UpdateBrandDTO {
  name?: string;
  logo?: string;
  updatedAt?: Date;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  parentId?: Types.ObjectId;
  createdAt?: Date;
}

export interface SizeDTO {
  sizeLabel: Number;
}

export interface ProductDTO {
  categoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  discount?: number;
  stock?: number;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductImageDTO {
  product_id: Types.ObjectId;
  image_url: string;
  isPrimary?: boolean;
}

export interface ProductVariantDTO {
  product_id: Types.ObjectId;
  color?: string;
  sizeId?: Types.ObjectId;
  stock?: number;
}
