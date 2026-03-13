import { Consumer } from "kafkajs";
import { EVENT_TOPICS, initKafka } from "@liad123121/whalo-common";
import { consume_score_events } from "./consumers/score-events";

let consumer: Consumer;

const connectKafka = async () => {
  const kafka = await initKafka();

  consumer = kafka.consumer({
    groupId: `${process.env.KAFKA_CLIENT_ID}-group`,
  });
  await consumer.connect();
  await consumer.subscribe({
    topics: [EVENT_TOPICS.SCORE_SUBMITTED],
    fromBeginning: true,
  });
  await consume_score_events();
};

export { consumer, connectKafka };
