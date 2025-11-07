import Redis from "ioredis";
import "dotenv/config";
import { logger } from "./utils/logger";

const redisUrl = process.env.REDIS_URL!;

const createRedisClient = () => {
  const client = new Redis(redisUrl);

  client.on("connect", () => {
    logger.info("Connected to Redis.");
  });

  client.on("error", (err) => {
    logger.error("Redis error:", err);
  });

  client.on("reconnecting", () => {
    logger.info("Reconnecting to Redis...");
  });

  return client;
};

export const publisher = createRedisClient();
export const subscriber = createRedisClient();
