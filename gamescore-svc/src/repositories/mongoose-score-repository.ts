import { Score } from "../models/score";
import { ScoreEntity, SubmitScoreInput } from "../domain/score";
import { ScoreRepository } from "./score-repository";

const toEntity = (doc: any): ScoreEntity => {
  const json = doc.toJSON();
  return {
    id: String(json.id),
    playerId: json.playerId,
    score: json.score,
  };
};

export class MongooseScoreRepository implements ScoreRepository {
  async create(input: SubmitScoreInput): Promise<ScoreEntity> {
    const score = Score.build(input);
    await score.save();
    return toEntity(score);
  }

  async findTop(limit: number): Promise<ScoreEntity[]> {
    const scores = await Score.find().sort({ score: -1 }).limit(limit);
    return scores.map(toEntity);
  }
}
