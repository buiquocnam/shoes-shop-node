// Ví dụ cơ bản về cấu trúc Authorize Middleware
import { Request, Response, NextFunction } from 'express';

// Role type có thể là 'admin', 'customer', v.v.
export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // ⚠️ Logic Tạm thời: 
        // Giả định thông tin user đã được gắn vào req.user bởi authenticate
        // Nếu req.user không có hoặc không có role, trả về lỗi.
        // const userRole = req.user.role; 

        // Tạm thời, chúng ta cần đảm bảo có thể chạy code này.
        // Nếu user chưa được gắn vào req, logic này sẽ lỗi.
        
        // Ví dụ kiểm tra:
        // if (allowedRoles.includes(userRole)) {
        //     next(); 
        // } else {
        //     res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
        // }

        next(); // Tạm thời cho phép tất cả để kiểm tra routing
    };
};