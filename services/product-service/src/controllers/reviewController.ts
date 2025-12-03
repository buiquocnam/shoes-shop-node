import { Request, Response, NextFunction } from 'express';
import reviewService from '../services/reviewService';
import { AuthRequest } from '../types/AuthRequest';

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Accept either `productId` (camelCase) or `product_id` (snake_case) from client
    const productId = req.body.productId || req.body.product_id;
    const { rating, comment } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "rating must be a number between 1 and 5" });
    }

    const reviewData = {
      product_id: productId,
      user_id: req.user.id,
      rating: numericRating,
      comment,
    };

    // Delegate creation + validation to service layer
    const created = await reviewService.createReview(reviewData as any);

    return res.status(201).json(created);
  } catch (error: any) {
    return next(error);
  }
};

export const getReviewsByProductId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const productId = req.params.productId;
        const result = await reviewService.getReviewsByProductId(productId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const reviewId = req.params.id;
        const result = await reviewService.deleteReview(reviewId);
        res.json(result);
    }   
    catch (err) {
        next(err);
    }
};

