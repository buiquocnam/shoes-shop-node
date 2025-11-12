import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'auth service ok' }));

app.listen(3001, () => {
  console.log('Auth service listening on http://localhost:3001');
});
