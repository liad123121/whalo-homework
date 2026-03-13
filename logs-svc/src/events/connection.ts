import { Consumer, Partitioners, Producer } from "kafkajs";
import {
  consume_player_id_events,
  EVENT_TOPICS,
  initKafka,
} from "@liad123121/whalo-common";
import { consume_logs_events } from "./consumers/logs-events";

let logs_consumer: Consumer;
let producer: Producer;

const connectKafka = async () => {
  const kafka = await initKafka();

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();

  logs_consumer = kafka.consumer({
    groupId: `${process.env.KAFKA_CLIENT_ID}-logs-group`,
    maxWaitTimeInMs: 5000,
    maxBytesPerPartition: 1048576,
  });
  await logs_consumer.connect();
  await logs_consumer.subscribe({
    topics: [EVENT_TOPICS.LOGS_COMMITTED],
  });

  const playerid_consumer = kafka.consumer({
    groupId: `${process.env.KAFKA_CLIENT_ID}-playerid-group`,
  });
  await playerid_consumer.connect();
  await playerid_consumer.subscribe({
    topics: [EVENT_TOPICS.PLAYER_CREATED, EVENT_TOPICS.PLAYER_DELETED],
    fromBeginning: true,
  });

  await consume_logs_events();
  await consume_player_id_events(playerid_consumer);
};

export { logs_consumer, producer, connectKafka };
