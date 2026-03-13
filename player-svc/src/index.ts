import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectMongo, logger } from "@liad123121/whalo-common";
import { connectKafka } from "./events/connection";

const PORT = process.env.PORT || 4000;

/**
 * Start the server after connecting to MongoDB and Kafka.
 */
const start = async () => {
  await connectKafka();
  await connectMongo();

  app.listen(PORT, () => {
    logger.info(`Player service is listening on port ${PORT}`);
  });
};

start();
