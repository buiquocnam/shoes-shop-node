import { Router } from 'express';
// ⚠️ Giả định các file middleware đã được tạo đúng đường dẫn và logic
import { authenticate } from '../middleware/authenticate'; 
import { authorize } from '../middleware/authorize';
import * as categoryController from '../controllers/categoryController';

const router = Router();

// --- PUBLIC: READ (Không cần Token) ---
router.get('/', categoryController.listCategories);
// router.get('/:id', categoryController.getCategoryById);

// --- ADMIN ONLY: CRUD (Cần Token và Role ADMIN) ---
router.post('/', authenticate, authorize(['ADMIN']), categoryController.createCategory);
// router.put('/:id', authenticate, authorize(['ADMIN']), categoryController.updateCategory);
// router.delete('/:id', authenticate, authorize(['ADMIN']), categoryController.deleteCategory);

export default router;