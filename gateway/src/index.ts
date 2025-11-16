import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => res.json({ status: 'gateway ok' }));

// Proxy routes to microservices
app.use('/auth', createProxyMiddleware({ 
  target: 'http://auth-service:3001', 
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: { '^/auth': '' } 
}));

app.use('/orders', createProxyMiddleware({ 
  target: 'http://order-service:3002', 
  changeOrigin: true, 
  pathRewrite: { '^/orders': '' } 
}));

app.use('/users', createProxyMiddleware({ 
  target: 'http://user-service:3003', 
  changeOrigin: true, 
  pathRewrite: { '^/users': '' } 
}));

app.listen(3000, () => {
  console.log('Gateway listening on http://localhost:3000');
});
