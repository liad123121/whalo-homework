import { ScoreDoc } from "../models/score";

interface SubmitScoreResponseSuccess {
  status: true;
  score: ScoreDoc;
}

interface ResponseError {
  status: false;
  error: string;
}

export type ScoreResponse = SubmitScoreResponseSuccess | ResponseError;

interface TopScoresResponseSuccess {
  status: true;
  scores: ScoreDoc[];
}

export type TopScoresResponse = TopScoresResponseSuccess | ResponseError;
