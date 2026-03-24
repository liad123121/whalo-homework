import { Request, Response } from "express";
import { LeaderboardResponse } from "../interfaces/response-props";
import { LeaderboardService } from "../services/leaderboard-service";

export const createLeaderboardController = (
  leaderboardService: LeaderboardService,
) => {
  const retrieveLeaderboard = async (
    req: Request,
    res: Response<LeaderboardResponse>,
  ) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const query: { limit?: string; page?: string } = {};

    if (limit !== undefined) {
      query.limit = limit;
    }

    if (page !== undefined) {
      query.page = page;
    }

    const result = await leaderboardService.retrieve(query);

    if (!result.ok) {
      return res.status(result.statusCode).send({ status: false, error: result.error });
    }

    return res.send({ status: true, leaderboard: result.data });
  };

  return { retrieveLeaderboard };
};
