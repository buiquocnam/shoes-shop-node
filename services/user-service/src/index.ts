import express from 'express';
import userRoutes from './routes';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'user service ok' }));

app.listen(3003, () => {
  console.log('User service listening on http://localhost:3003');
});

app.use('/users', userRoutes);

export default app;
