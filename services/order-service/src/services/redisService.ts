import redis from "../config/redis";
import redisClient from "../config/redis";

export class RedisService {
  // Token management
  private static REFRESH_TOKEN_PREFIX = "refresh_token:";
  private static REFRESH_TOKEN_EXPIRATION = Math.floor(parseInt(process.env.JWT_REFRESH_EXPIRATION || "604800000") / 1000);    
  
  async setRefreshToken(userId: string, token: string): Promise<void> {
    const key = `${RedisService.REFRESH_TOKEN_PREFIX}${userId}`;
    await redis.setex(key, RedisService.REFRESH_TOKEN_EXPIRATION, token);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `${RedisService.REFRESH_TOKEN_PREFIX}${userId}`;
    return await redis.get(key);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await redisClient.del(userId);
  }
}

export default new RedisService();
