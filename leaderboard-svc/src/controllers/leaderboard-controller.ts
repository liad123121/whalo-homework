import { Request, Response } from "express";
import { logger, redisClient } from "@liad123121/whalo-common";
import { REDIS_KEYS } from "../utils/constants";
import {
  LeaderboardEntry,
  LeaderboardResponse,
} from "../interfaces/response-props";

/**
 * Retrieve the leaderboard with pagination support. The request can include optional query parameters for limit and page to control the number of entries returned and the page of results. The leaderboard is retrieved from Redis, sorted by score in descending order, and returned in the response.
 * @param req - The request object.
 * @param res - The response object.
 * @queryParam limit - Optional query parameter to specify the maximum number of leaderboard entries to return. Defaults to 10 if not provided or invalid.
 * @queryParam page - Optional query parameter to specify the page of results to return. Defaults to 0 (the first page) if not provided or invalid.
 * @returns A response containing the leaderboard entries.
 */
const retrieveLeaderboard = async (
  req: Request,
  res: Response<LeaderboardResponse>,
) => {
  const { limit, page } = req.query as { limit?: string; page?: string };

  try {
    const MAX_LIMIT = limit && !isNaN(parseInt(limit)) ? parseInt(limit) : 10;
    const PAGE = page && !isNaN(parseInt(page)) ? parseInt(page) : 0;

    const leaderboardData = await redisClient.zrevrange(
      REDIS_KEYS.LEADERBOARD,
      PAGE * MAX_LIMIT,
      (PAGE + 1) * MAX_LIMIT - 1,
      "WITHSCORES",
    );

    const leaderboard: LeaderboardEntry[] = [];
    for (let i = 0; i < leaderboardData.length; i += 2) {
      leaderboard.push({
        playerId: leaderboardData[i]!,
        score: Number(leaderboardData[i + 1]),
      });
    }

    res.send({ status: true, leaderboard });
  } catch (error) {
    throw error;
  }
};

export { retrieveLeaderboard };
