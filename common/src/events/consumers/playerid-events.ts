import { Consumer } from "kafkajs";
import { EVENT_TOPICS } from "../types";
import { redisClient } from "../../db/redis";
import { SHARED_REDIS_KEYS } from "../../constants";
import { logger } from "../../utils/logger";

export const consume_player_id_events = async (consumer: Consumer) => {
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const { value } = message;
      const { playerId } = JSON.parse(value.toString());

      switch (topic) {
        case EVENT_TOPICS.PLAYER_CREATED:
          await redisClient.sadd(SHARED_REDIS_KEYS.ACTIVE_PLAYERS, playerId);
          logger.info(`Added player ${playerId} to active_players set`);
          break;
        case EVENT_TOPICS.PLAYER_DELETED:
          await redisClient.srem(SHARED_REDIS_KEYS.ACTIVE_PLAYERS, playerId);
          logger.info(`Removed player ${playerId} from active_players set`);
          break;
        default:
          logger.warn(`Received message with unknown topic: ${topic}`);
      }
    },
  });
};
