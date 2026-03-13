import Redis from "ioredis";
import { logger } from "../utils/logger";

let redisClient: Redis;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL environment variable is not set");
  }

  try {
    redisClient = new Redis(process.env.REDIS_URL);

    await new Promise<void>((resolve, reject) => {
      redisClient.on("ready", () => {
        logger.info("Connected to Redis");
        resolve();
      });
      redisClient.on("error", reject);
    });
  } catch (error) {
    logger.error("Error connecting to Redis:", error);
    throw error;
  }
};

export { connectRedis, redisClient };
