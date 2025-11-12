import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'user service ok' }));

app.listen(3003, () => {
  console.log('User service listening on http://localhost:3003');
});
