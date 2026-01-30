import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { LoginDTO, RegisterDTO } from "../types/auth.types";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginData: LoginDTO = req.body;
    const result = await authService.login(loginData);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response
) => {
    const registerData: RegisterDTO = req.body;
    const result = await authService.register(registerData);
    res.json(result); 
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Implement logout logic if needed
    res.json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  } 
};