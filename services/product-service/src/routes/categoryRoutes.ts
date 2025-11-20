import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/authorize';   // ← ĐÃ DÙNG HÀM MỚI
import * as categoryController from '../controllers/categoryController';

const router = Router();

// PUBLIC
router.get('/', categoryController.listCategories);

// ADMIN ONLY – DÙNG requireAdmin ĐÃ CHECK roleId
router.post('/', authenticate, requireAdmin, categoryController.createCategory);
// router.put('/:id', authenticate, requireAdmin, categoryController.updateCategory);
// router.delete('/:id', authenticate, requireAdmin, categoryController.deleteCategory);

export default router;