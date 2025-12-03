import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtUserPayload } from "../types/AuthRequest";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Decoded JWT:", decoded);

    // Gán req.user đúng interface JwtUserPayload
    req.user = {
      id: decoded.userId,      // ánh xạ userId -> id
      email: decoded.email,
      role: decoded.role        // optional
    } as JwtUserPayload;

    next();
  } catch (err: any) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
