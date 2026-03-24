import { logger } from "@liad123121/whalo-common";
import { ScoreEntity, SubmitScoreInput } from "../domain/score";
import { ServiceResult } from "../domain/service-result";
import { ScoreEventsPublisher } from "../events/score-events-publisher";
import { ScoreRepository } from "../repositories/score-repository";

export class GamescoreService {
  constructor(
    private readonly scoreRepository: ScoreRepository,
    private readonly eventsPublisher: ScoreEventsPublisher,
  ) {}

  async submit(input: SubmitScoreInput): Promise<ServiceResult<ScoreEntity>> {
    if (!input.playerId || Number.isNaN(input.score)) {
      return { ok: false, statusCode: 400, error: "Invalid request" };
    }

    const newScore = await this.scoreRepository.create(input);

    logger.info(
      `New score submitted for playerId: ${newScore.playerId} with score: ${newScore.score}`,
    );

    try {
      await this.eventsPublisher.publishScoreSubmitted(input.playerId, input.score);
    } catch (error) {
      logger.error("Error publishing score updated event:", error);
    }

    return { ok: true, data: newScore };
  }

  async topScores(limit: number): Promise<ServiceResult<ScoreEntity[]>> {
    const topScores = await this.scoreRepository.findTop(limit);
    return { ok: true, data: topScores };
  }
}
