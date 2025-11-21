import { Router } from 'express';
const router = Router();
router.post('/login', (req, res) => {
    res.json({ token: 'fake-token' });
});
export default router;
