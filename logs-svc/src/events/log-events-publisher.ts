import { EVENT_TOPICS } from "@liad123121/whalo-common";
import { producer } from "./connection";
import { LogEntryInput } from "../domain/log";

export interface LogEventsPublisher {
  publish(log: LogEntryInput): Promise<void>;
}

export class KafkaLogEventsPublisher implements LogEventsPublisher {
  async publish(log: LogEntryInput): Promise<void> {
    await producer.send({
      topic: EVENT_TOPICS.LOGS_COMMITTED,
      messages: [
        {
          value: JSON.stringify(log),
          partition: log.level,
        },
      ],
    });
  }
}
