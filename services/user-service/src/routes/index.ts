import { Router } from 'express';
import { getUsers } from '../controllers/userController';

const router = Router();

router.get('/list', getUsers);

export default router;
