import { create_event, delete_event } from "./producers/player-events";

export interface PlayerEventsPublisher {
  publishPlayerCreated(playerId: string): Promise<void>;
  publishPlayerDeleted(playerId: string): Promise<void>;
}

export class KafkaPlayerEventsPublisher implements PlayerEventsPublisher {
  async publishPlayerCreated(playerId: string): Promise<void> {
    await create_event(playerId);
  }

  async publishPlayerDeleted(playerId: string): Promise<void> {
    await delete_event(playerId);
  }
}
