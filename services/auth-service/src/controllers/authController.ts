import { Request, Response } from "express";
import authService from "../services/authService";
import { LoginDTO, RegisterDTO } from "../types/auth.types";

export const login = async (
  req: Request,
  res: Response,
) => {
    const loginData: LoginDTO = req.body;
    const result = await authService.login(loginData);
    res.json(result); 
};

export const register = async (
  req: Request,
  res: Response
) => {
    const registerData: RegisterDTO = req.body;
    const result = await authService.register(registerData);
    res.json(result); 
};
