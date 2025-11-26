import { PrismaClient } from '@prisma/client';

// Khởi tạo một instance duy nhất (đối tượng)
const prisma = new PrismaClient();

export default prisma; // Xuất đối tượng này để code có thể dùng