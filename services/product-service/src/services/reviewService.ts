import Review from "../models/Review";
import createError from "http-errors";
import { ReviewDTO } from "../types/product.types";
import e from "express";

export class reviewService {
    async createReview(reviewData: ReviewDTO) {
        try {
            const { product_id, user_id, rating, comment } = reviewData;
            if (!product_id || !user_id || rating === undefined || rating === null) {
                throw createError.BadRequest("product_id, user_id, and rating are required");
            }
            if (rating < 1 || rating > 5) {
                throw createError.BadRequest("rating must be between 1 and 5");
            }
            const newReview = new Review({ product_id, user_id, rating, comment });
            await newReview.save();
            return newReview;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Create review failed");
        }
    }

    async getReviewsByProductId(productId: string) {
        try {
            const reviews = await Review.find({ product_id: productId });
            return reviews;
        } catch (err: any) {
            throw createError(err.status || 500, err.message || "Get reviews failed");
        }
    }

    async deleteReview(reviewId: string) {  
        try {
            const review = await Review.findByIdAndDelete(reviewId);
            if (!review) {
                throw createError.NotFound("Review not found");
            }
            return review;
        }
        catch (err: any) {
            throw createError(err.status || 500, err.message || "Delete review failed");
        }
    }
}

export default new reviewService();