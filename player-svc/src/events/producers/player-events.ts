import { producer } from "../connection";
import { EVENT_TOPICS } from "@liad123121/whalo-common";

export const create_event = async (playerId: string) => {
  await producer.send({
    topic: EVENT_TOPICS.PLAYER_CREATED,
    messages: [
      {
        value: JSON.stringify({ playerId }),
      },
    ],
  });
};

export const delete_event = async (playerId: string) => {
  await producer.send({
    topic: EVENT_TOPICS.PLAYER_DELETED,
    messages: [
      {
        value: JSON.stringify({ playerId }),
      },
    ],
  });
};
