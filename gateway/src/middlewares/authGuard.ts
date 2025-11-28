import { Request, Response, NextFunction } from "express";
import { isPublicRoute } from "../config/routes";
import { authenticateToken, AuthRequest } from "./authMiddleware";

export const authGuard = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Skip authentication for public routes
  if (isPublicRoute(req.path)) {
    return next();
  }

  // Require authentication for protected routes
  return authenticateToken(req, res, next);
};
