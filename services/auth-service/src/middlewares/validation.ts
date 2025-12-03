import { Request, Response, NextFunction } from "express";
import { LoginDTO, RegisterDTO } from "../types/auth.types";
import createError from "http-errors";

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as LoginDTO;

  if (!email || !password) {
    throw createError.BadRequest("Email and password are required");
  }

  //   // Basic email validation
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     throw createError.BadRequest("Invalid email format");
  //   }

  //   if (password.length < 6) {
  //     throw createError.BadRequest("Password must be at least 6 characters");
  //   }

  next();
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as RegisterDTO;

  if (!email || !password) {
    throw createError.BadRequest("Email and password are required");
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError.BadRequest("Invalid email format");
  }

  if (password.length < 6) {
    throw createError.BadRequest("Password must be at least 6 characters");
  }

  next();
};

export const validateLogout = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    throw createError.BadRequest("Refresh token is required for logout");
  }
  next();
};  
