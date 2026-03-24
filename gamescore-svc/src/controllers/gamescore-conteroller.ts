import { Request, Response } from "express";
import { ScoreResponse, TopScoresResponse } from "../interfaces/response-props";
import { GamescoreService } from "../services/gamescore-service";

export const createGamescoreController = (gamescoreService: GamescoreService) => {
  const submitScore = async (req: Request, res: Response<ScoreResponse>) => {
    const { playerId, score } = req.body as { playerId: string; score: number };
    const result = await gamescoreService.submit({ playerId, score });

    if (!result.ok) {
      return res.status(result.statusCode).send({ status: false, error: result.error });
    }

    return res.status(201).send({ status: true, score: result.data });
  };

  const topScores = async (req: Request, res: Response<TopScoresResponse>) => {
    const result = await gamescoreService.topScores(10);

    if (!result.ok) {
      return res.status(result.statusCode).send({ status: false, error: result.error });
    }

    return res.status(200).send({ status: true, scores: result.data });
  };

  return { submitScore, topScores };
};
