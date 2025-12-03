import { Request } from "express";

export interface JwtUserPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtUserPayload; // optional vì không phải route nào cũng có token
}
