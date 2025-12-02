# Sử dụng Node 18
FROM node:18

# Thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json để cài dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source vào container
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Command chạy app
CMD ["node", "dist/index.js"]
