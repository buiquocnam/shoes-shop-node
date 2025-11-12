import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'order service ok' }));

app.listen(3002, () => {
  console.log('Order service listening on http://localhost:3002');
});
