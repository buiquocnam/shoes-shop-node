import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  
  listBrands,
  createBrand
} from '../controllers/productController';
import {
  listCoupons,
  getCoupon,
  createCoupon,
  deleteCoupon
} from '../controllers/couponController';
import {
  listReviews,
  createReview,
  deleteReview,
  updateReview,
  getReviewsByProduct
} from '../controllers/reviewController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';


import {listCategories,
  createCategory} from '../controllers/categoryController';
import { get } from 'http';
const router = Router();

// Products
router.get('/products', listProducts);
router.get('/products/:id', getProduct);
router.post('/products',authenticate, authorize(['ADMIN']), createProduct);

// Categories
router.get('/categories', listCategories);
router.post('/categories',authenticate, authorize(['ADMIN']), createCategory);

// Brands
router.post('/brands',authenticate, authorize(['ADMIN']), createBrand);
router.get('/brands', listBrands);

//Coupons
router.get('/coupons', listCoupons);
router.get('/coupons/:id', getCoupon);
router.post('/coupons',authenticate, authorize(['ADMIN']), createCoupon);
router.delete('/coupons/:id',authenticate, authorize(['ADMIN']), deleteCoupon);

//Reviews
router.get('/reviews', listReviews);
// router.post('/reviews', authenticate, createReview);
// router.delete('/reviews/:id', authenticate, deleteReview);
// router.put('/reviews/:id', authenticate, updateReview);
router.get('/reviews/product/:productId', getReviewsByProduct);
export default router;
