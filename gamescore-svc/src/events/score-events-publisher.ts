import { publish_score_updated_event } from "./producers/score-events";

export interface ScoreEventsPublisher {
  publishScoreSubmitted(playerId: string, score: number): Promise<void>;
}

export class KafkaScoreEventsPublisher implements ScoreEventsPublisher {
  async publishScoreSubmitted(playerId: string, score: number): Promise<void> {
    await publish_score_updated_event(playerId, score);
  }
}
