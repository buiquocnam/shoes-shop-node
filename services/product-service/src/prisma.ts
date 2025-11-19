// File: product-service/src/prisma.ts
import { PrismaClient } from '@prisma/client';

// Khởi tạo Prisma Client
const prisma = new PrismaClient();

// Export instance để các file Controller khác có thể sử dụng
export default prisma;