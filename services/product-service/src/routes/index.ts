import { Router } from "express";
import { getBrands, createBrand, updateBrand, deleteBrand, getBrandById } from "../controllers/brandController";
import { getCategories, createCategory, deleteCategory, getCategoryById } from "../controllers/categoryController";
import { getSizes, createSize, deleteSize, getSizeById } from "../controllers/sizeController";
import { createProductVariant, deleteProductVariant, getProductVariantById } from "../controllers/productVariantController";
import { uploadProductImage, getProductImages, deleteProductImage  } from "../controllers/productImageController";
import { getProductById, createProduct, updateProduct, deleteProduct, getProducts } from "../controllers/productController";
import { getReviewsByProductId, createReview, deleteReview } from "../controllers/reviewController";
import { upload } from "../middlewares/upload";
import authMiddleware from "../middlewares/authMiddleware";
import { get } from "http";

const router = Router();

router.get("/brands",getBrands);
router.get("brands/:id",getBrandById);
router.post("/brands",createBrand);
router.put("/brands:id",updateBrand);
router.delete("/brands:id",deleteBrand);

router.get("/categories",getCategories);
router.get("/categories/:id",getCategoryById);
router.post("/categories",createCategory);
router.delete("/categories/:id",deleteCategory);

router.get("/sizes",getSizes);
router.get("/sizes/:id",getSizeById);
router.post("/sizes",createSize);
router.delete("/sizes/:id",deleteSize);

router.get("/product-variants/:variant_id",getProductVariantById);
router.post("/product-variants",createProductVariant);
router.delete("/product-variants/:id",deleteProductVariant);

router.post("/upload", upload.single("image"), uploadProductImage);
router.get("/product-images",getProductImages);
router.delete("/product-images/:id",deleteProductImage);

router.get("/products/:id",getProductById);
router.post("/products",createProduct);
router.put("/products/:id",updateProduct);
router.delete("/products/:id",deleteProduct);
router.get("/products",getProducts);

router.get("/reviews/product/:productId",getReviewsByProductId);
router.post("/reviews", authMiddleware ,createReview);
router.delete("/reviews/:id",deleteReview);

export default router;
