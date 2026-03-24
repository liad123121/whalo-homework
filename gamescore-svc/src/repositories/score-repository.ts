import { ScoreEntity, SubmitScoreInput } from "../domain/score";

export interface ScoreRepository {
  create(input: SubmitScoreInput): Promise<ScoreEntity>;
  findTop(limit: number): Promise<ScoreEntity[]>;
}
