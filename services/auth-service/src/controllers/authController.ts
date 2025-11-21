import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'; 

// ===========================================
//             HÀM ĐĂNG NHẬP (LOGIN) (GIỮ NGUYÊN)
// ===========================================

export const login = async (req: Request, res: Response) => {
    // ... (Phần code login giữ nguyên - nó đã đúng) ...
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role_id: true,
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isAdmin = 
      user.role_id === '00000000-0000-0000-0000-000000000001' || 
      user.role_id === '00000000-0000-0000-0000-000000000002';

    const token = jwt.sign(
      {
        userId: user.id,           // hoặc id: user.id tùy bạn
        email: user.email,
        roleId: user.role_id,      // giữ lại để tương thích cũ
        role: isAdmin ? 'ADMIN' : 'CUSTOMER',  // ← CÁI NÀY LÀM NÊN TẤT CẢ!!!
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
};

// ===========================================
//             HÀM ĐĂNG KÝ (REGISTER) (SỬA ĐỔI)
// ===========================================

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields (email, password, name).' });
    }
    
    // 1. Tìm hoặc tạo Role mặc định (CUSTOMER)
    let customerRole = await prisma.role.findUnique({
        where: { name: 'CUSTOMER' }
    });

    if (!customerRole) {
        console.warn("Role 'CUSTOMER' not found, creating it.");
        customerRole = await prisma.role.create({
            data: { name: 'CUSTOMER' }
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Tạo User và gán role_id
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role_id: customerRole.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        // ⚠️ SỬA LỖI: Loại bỏ hoàn toàn 'createdAt: true' khỏi select
        // Prisma sẽ tự động thêm các trường không select vào kết quả trả về
        // nếu chúng không phải là trường quan hệ.
        role_id: true,
      }
    });

    // Nếu bạn muốn hiển thị createdAt, bạn có thể lấy nó từ đối tượng user (user.createdAt)
    // vì Prisma thường trả về các trường mặc định (như ID, thời gian)
    // ngay cả khi không có trong select.
    res.status(201).json({ 
        message: 'User registered successfully', 
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role_id: user.role_id,
            // Nếu bạn muốn trả về createdAt, thử truy cập user.createdAt, 
            // nếu vẫn lỗi, hãy bỏ qua nó trong response.
        }
    });
  } catch (err: any) {
    console.error('Registration Error:', err);

    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
};

// ===========================================
//             HÀM ĐĂNG XUẤT (LOGOUT) (GIỮ NGUYÊN)
// ===========================================

export const logout = async (req: Request, res: Response) => {
    // ... (Phần code logout giữ nguyên) ...
    try {
        res.json({ message: 'Logged out successfully' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
};

export default { login, register, logout };