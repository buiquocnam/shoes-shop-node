import express from 'express';
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'auth service ok' }));
// ⚠️ Nếu bạn có sử dụng Prisma Client, bạn nên khởi tạo nó ở đây.
// Ví dụ:
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// (Đảm bảo bạn xử lý lỗi kết nối DB nếu cần)
app.listen(3001, () => {
    console.log('Auth service listening on http://localhost:3001');
});
