import express from 'express';
import { PrismaClient } from '@prisma/client';
import productRoutes from './routes/routes'

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3004;

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'product service ok' }));

app.use('/', productRoutes);

app.listen(PORT, () => {
  console.log(`Product service listening on http://localhost:${PORT}`);
});

export default app;
