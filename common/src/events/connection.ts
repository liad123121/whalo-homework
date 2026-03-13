import { Kafka } from "kafkajs";
import { EVENT_TOPICS } from "./types";

const initKafka = async () => {
  if (!process.env.KAFKA_BROKERS) {
    throw new Error(
      "Kafka broker addresses are not defined in environment variables",
    );
  }

  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("Kafka client ID is not defined in environment variables");
  }

  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: process.env.KAFKA_BROKERS.split(","),
  });
  const admin = kafka.admin();

  try {
    await admin.connect();
    await admin.createTopics({
      waitForLeaders: true,
      topics: Object.values(EVENT_TOPICS).map((topic) => ({
        topic,
        numPartitions: process.env.KAFKA_NUM_PARTITIONS
          ? parseInt(process.env.KAFKA_NUM_PARTITIONS)
          : 1,
        replicationFactor: 1,
      })),
    });
  } finally {
    await admin.disconnect();
  }

  return kafka;
};

export { initKafka };
