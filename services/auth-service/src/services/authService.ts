import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { LoginDTO, RegisterDTO, AuthResponse } from "../types/auth.types";
import redisService from "./redisService";
import createError from "http-errors";

export class AuthService {
  async login(loginData: LoginDTO): Promise<AuthResponse> {
    const { email, password } = loginData;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw createError.NotFound("User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw createError.Unauthorized("Invalid email or password");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    await redisService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null,
      },
    };
  }
  async register(registerData: RegisterDTO): Promise<AuthResponse> {
    const { email, password, name } = registerData;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw createError.Conflict("User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase(),
      name: name || undefined,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    await redisService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const tokenPayload = verifyToken(refreshToken);
    if (!tokenPayload) {
      throw createError.Unauthorized("Invalid refresh toke or expired");
    }
    const storedRefreshToken = await redisService.getRefreshToken(
      tokenPayload.userId
    );
    if (!storedRefreshToken) {
      throw createError.Unauthorized("Invalid refresh token");
    }
    const accessToken = generateAccessToken({
      userId: tokenPayload.userId,
      email: tokenPayload.email,
    });
    const newRefreshToken = generateRefreshToken({
      userId: tokenPayload.userId,
      email: tokenPayload.email,
    });
    await redisService.setRefreshToken(tokenPayload.userId, newRefreshToken);
    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: tokenPayload.userId,
        email: tokenPayload.email,
        name: null,
      },
    };
  }
}
export default new AuthService();
