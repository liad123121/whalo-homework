import { Request, Response } from "express";
import { ScoreResponse, TopScoresResponse } from "../interfaces/response-props";
import { Score } from "../models/score";
import { publish_score_updated_event } from "../events/producers/score-events";
import { logger } from "@liad123121/whalo-common";

/**
 * Submit a new score for a player. The request body should contain the playerId and the score value.
 * @param req - The request object containing the playerId and score.
 * @param res - The response object used to send the result back to the client.
 * @returns A response indicating the result of the score submission.
 */
const submitScore = async (req: Request, res: Response<ScoreResponse>) => {
  const { playerId, score } = req.body as { playerId: string; score: number };

  if (!playerId || !score || isNaN(score)) {
    return res.status(400).send({
      status: false,
      error: "Invalid request",
    });
  }

  try {
    const newScore = Score.build({
      playerId,
      score,
    });

    await newScore.save();

    logger.info(
      `New score submitted for playerId: ${newScore.playerId} with score: ${newScore.score}`,
    );

    try {
      await publish_score_updated_event(playerId, score);
    } catch (error) {
      logger.error("Error publishing score updated event:", error);
    }

    return res.status(201).send({ status: true, score: newScore });
  } catch (error) {
    throw error;
  }
};

/**
 * Get the top 10 scores across all players. The scores are sorted in descending order.
 * @param req - The request object for fetching top scores.
 * @param res - The response object used to send the top scores back to the client.
 * @returns A response containing the top 10 scores or an error message if the operation fails.
 */
const topScores = async (req: Request, res: Response<TopScoresResponse>) => {
  try {
    const topTenScores = await Score.find().sort({ score: -1 }).limit(10);
    return res.status(200).send({ status: true, scores: topTenScores });
  } catch (error) {
    throw error;
  }
};

export { submitScore, topScores };
