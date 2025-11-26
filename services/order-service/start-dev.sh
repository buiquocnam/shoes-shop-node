#!/bin/sh

# Buoc 1: Cai dat dependencies
npm install

# Buoc 2: Build code TypeScript
npm run build

# Buoc 3: Ap dung Prisma Migration (chi chay khi DB da san sang)
npx prisma migrate deploy

# Buoc 4: Khoi dong server (LENH NAY PHAI CHAY MAI MAI)
npm run start