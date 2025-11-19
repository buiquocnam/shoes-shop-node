// Ví dụ cơ bản về cấu trúc Authenticate Middleware
import { Request, Response, NextFunction } from 'express';
// import axios from 'axios'; // Dùng để gọi Auth Service

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        // ⚠️ Logic gọi Auth Service để xác thực Token và lấy role
        // const authResponse = await axios.post('http://auth-service:3001/auth/validate', { token });
        
        // Tạm thời: Gắn role giả định từ token đã được decode
        // Trong hệ thống thật, bạn phải gắn payload (chứa id, email, role)
        (req as any).user = { id: '...', role: 'ADMIN' }; // Giả định thành công
        
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token or authentication failed.' });
    }
};