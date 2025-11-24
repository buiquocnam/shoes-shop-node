import { Request, Response } from 'express';
import prisma from '../prisma';

export const getUsers = async (req: Request, res: Response) => {
    try {
        console.log('Attempting to fetch users...'); // Ghi log bắt đầu
        
        const users = await prisma.user.findMany({
          select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                // Lấy thông tin role thông qua quan hệ (relationship)
                role: {
                    select: {
                        name: true, // Chỉ lấy tên của role
                    },
                },
            },
        }); 
        
        console.log('Query successful. Users found:', users.length); // ⚠️ Ghi lại số lượng tìm thấy
        console.log('Result data:', users); // ⚠️ Ghi lại dữ liệu thô (Dùng cẩn thận trong Prod)
        
        return res.status(200).json({ users }); 
        
    } catch (error) {
        // Ghi lại lỗi nếu truy vấn thất bại
        console.error("DATABASE QUERY ERROR:", error); 
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getUsers;
