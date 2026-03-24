export interface ScoreEntity {
  id: string;
  playerId: string;
  score: number;
}

export interface SubmitScoreInput {
  playerId: string;
  score: number;
}
