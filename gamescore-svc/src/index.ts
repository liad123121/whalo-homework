import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectMongo, connectRedis, logger } from "@liad123121/whalo-common";
import { connectKafka } from "./events/connection";

const PORT = process.env.PORT || 4001;

/**
 * Start the server after connecting to MongoDB, Redis and Kafka.
 */
const start = async () => {
  await connectKafka();
  await connectMongo();
  await connectRedis();

  app.listen(PORT, () => {
    logger.info(`Gamescore service is listening on port ${PORT}`);
  });
};

start();
