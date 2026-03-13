import { Consumer, Partitioners, Producer } from "kafkajs";
import {
  EVENT_TOPICS,
  initKafka,
  consume_player_id_events,
} from "@liad123121/whalo-common";

let producer: Producer;
let consumer: Consumer;

const connectKafka = async () => {
  const kafka = await initKafka();
  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();

  consumer = kafka.consumer({
    groupId: `${process.env.KAFKA_CLIENT_ID}-group`,
  });
  await consumer.connect();
  await consumer.subscribe({
    topics: [EVENT_TOPICS.PLAYER_CREATED, EVENT_TOPICS.PLAYER_DELETED],
    fromBeginning: true,
  });
  await consume_player_id_events(consumer);
};

export { producer, consumer, connectKafka };
