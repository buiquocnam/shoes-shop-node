import express from 'express';
import orderRouter from './routes/index';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'order service ok' }));

app.use("/", orderRouter);

app.listen(3003, () => {
  console.log('Order service listening on http://localhost:3003');
});
