import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || "3600000";
const JWT_REFRESH_EXPIRATION =
  process.env.JWT_REFRESH_EXPIRATION || "604800000";

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: Math.floor(parseInt(JWT_REFRESH_EXPIRATION) / 1000),
  });
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: Math.floor(parseInt(JWT_ACCESS_EXPIRATION) / 1000),
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
