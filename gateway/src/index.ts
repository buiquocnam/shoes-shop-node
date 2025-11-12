import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'gateway ok' }));

// Proxy routes to microservices
app.use('/auth', createProxyMiddleware({ 
  target: 'http://localhost:3001', 
  changeOrigin: true, 
  pathRewrite: { '^/auth': '' } 
}));

app.use('/orders', createProxyMiddleware({ 
  target: 'http://localhost:3002', 
  changeOrigin: true, 
  pathRewrite: { '^/orders': '' } 
}));

app.use('/users', createProxyMiddleware({ 
  target: 'http://localhost:3003', 
  changeOrigin: true, 
  pathRewrite: { '^/users': '' } 
}));

app.listen(4000, () => {
  console.log('Gateway listening on http://localhost:4000');
});
