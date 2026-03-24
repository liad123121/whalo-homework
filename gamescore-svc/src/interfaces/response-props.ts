import { ScoreEntity } from "../domain/score";

interface SubmitScoreResponseSuccess {
  status: true;
  score: ScoreEntity;
}

interface ResponseError {
  status: false;
  error: string;
}

export type ScoreResponse = SubmitScoreResponseSuccess | ResponseError;

interface TopScoresResponseSuccess {
  status: true;
  scores: ScoreEntity[];
}

export type TopScoresResponse = TopScoresResponseSuccess | ResponseError;
