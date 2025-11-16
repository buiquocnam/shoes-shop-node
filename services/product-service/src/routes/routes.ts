import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  listCategories,
  createCategory,
  listBrands,
  createBrand
} from '../controllers/productController';

const router = Router();

// Products
router.get('/products', listProducts);
router.get('/products/:id', getProduct);
router.post('/products', createProduct);

// Categories
router.get('/categories', listCategories);
router.post('/categories', createCategory);

// Brands
router.get('/brands', listBrands);
router.post('/brands', createBrand);

export default router;
