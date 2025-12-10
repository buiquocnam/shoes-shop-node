import { Request } from "express";
import { JwtUserPayload } from "../types/JwtUserPayload";

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}
