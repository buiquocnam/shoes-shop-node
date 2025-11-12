import { Router } from 'express';

const router = Router();

router.get('/list', (req, res) => {
  res.json({ orders: [] });
});

export default router;
