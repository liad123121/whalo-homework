import { REDIS_KEYS } from "../../utils/constants";
import { consumer } from "../connection";
import { EVENT_TOPICS, logger, redisClient } from "@liad123121/whalo-common";

export const consume_score_events = async () => {
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const { value } = message;
      const { playerId, score } = JSON.parse(value.toString());

      switch (topic) {
        case EVENT_TOPICS.SCORE_SUBMITTED:
          logger.info(`Received score update for player ${playerId}: ${score}`);
          await redisClient.zincrby(REDIS_KEYS.LEADERBOARD, score, playerId);
          break;
        default:
          logger.warn(`Received message with unknown topic: ${topic}`);
      }
    },
  });
};
