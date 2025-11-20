import { Router } from 'express';
import { login, register ,logout } from '../controllers/authController';
import getUsers from '../controllers/userController';
import { get } from 'http';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/list',getUsers);

export default router;
