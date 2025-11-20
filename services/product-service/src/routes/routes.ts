import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  
  listBrands,
  createBrand
} from '../controllers/productController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

import {listCategories,
  createCategory} from '../controllers/categoryController';
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

export default router;
