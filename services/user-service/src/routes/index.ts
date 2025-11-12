import { Router } from 'express';

const router = Router();

router.get('/list', (req, res) => {
  res.json({ users: [] });
});

export default router;
