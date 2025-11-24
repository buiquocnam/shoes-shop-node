import express, { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/index';

const app = express();
const prisma = new PrismaClient(); 
const PORT = 3001;

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'auth service ok' });
});

app.use('/', authRoutes);

// LẮNG NGHE
app.listen(PORT, () => {
  console.log(`Auth service listening on http://localhost:${PORT}`);
});