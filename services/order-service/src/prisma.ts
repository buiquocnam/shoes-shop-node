// File: services/*/src/prisma.ts   ← để thẳng trong src

import { PrismaClient } from '@prisma/client';

// Đảm bảo chỉ 1 instance duy nhất (rất quan trọng!)
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;