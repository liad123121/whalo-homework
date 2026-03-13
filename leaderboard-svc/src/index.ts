import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectRedis, logger } from "@liad123121/whalo-common";
import { connectKafka } from "./events/connection";

const PORT = process.env.PORT || 4002;

/**
 * Start the server after connecting to Redis and Kafka.
 */
const start = async () => {
  await connectKafka();
  await connectRedis();

  app.listen(PORT, () => {
    logger.info(`Leaderboard service is listening on port ${PORT}`);
  });
};

start();
