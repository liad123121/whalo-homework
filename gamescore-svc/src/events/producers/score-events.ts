import { EVENT_TOPICS } from "@liad123121/whalo-common";
import { producer } from "../connection";

export const publish_score_updated_event = async (
  playerId: string,
  score: number,
) => {
  await producer.send({
    topic: EVENT_TOPICS.SCORE_SUBMITTED,
    messages: [
      {
        value: JSON.stringify({ playerId, score }),
      },
    ],
  });
};
