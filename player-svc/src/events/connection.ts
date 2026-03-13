import { Partitioners, Producer } from "kafkajs";
import { initKafka } from "@liad123121/whalo-common";

let producer: Producer;

const connectKafka = async () => {
  const kafka = await initKafka();
  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();
};

export { producer, connectKafka };
