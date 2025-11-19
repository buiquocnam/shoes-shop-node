// Ví dụ cơ bản về cấu trúc Authorize Middleware
import { Request, Response, NextFunction } from 'express';

// Định nghĩa lại Request để bao gồm thuộc tính user
interface AuthenticatedRequest extends Request {
    user?: { id: string; role: string; }; 
}

export const authorize = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        
        const user = req.user;

        if (!user || !user.role) {
            // Lỗi xảy ra nếu authenticate chưa gắn role hoặc user
            return res.status(403).json({ message: 'Forbidden: User role not found.' });
        }
        
        // Kiểm tra xem role của user có nằm trong danh sách được phép không
        const isAuthorized = allowedRoles.includes(user.role);

        if (isAuthorized) {
            next();
        } else {
            return res.status(403).json({ message: `Forbidden. Role must be one of: ${allowedRoles.join(', ')}` });
        }
    };
};