import { Router } from 'express';
import { getUsers } from '../controllers/userController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/list', authenticate, authorize(['admin']), getUsers);

export default router;
