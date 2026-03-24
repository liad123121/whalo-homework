import { redisClient } from "@liad123121/whalo-common";
import { REDIS_KEYS } from "../utils/constants";
import { LeaderboardEntry } from "../domain/leaderboard";
import { LeaderboardRepository } from "./leaderboard-repository";

export class RedisLeaderboardRepository implements LeaderboardRepository {
  async getPage(page: number, limit: number): Promise<LeaderboardEntry[]> {
    const leaderboardData = await redisClient.zrevrange(
      REDIS_KEYS.LEADERBOARD,
      page * limit,
      (page + 1) * limit - 1,
      "WITHSCORES",
    );

    const leaderboard: LeaderboardEntry[] = [];

    for (let i = 0; i < leaderboardData.length; i += 2) {
      leaderboard.push({
        playerId: leaderboardData[i]!,
        score: Number(leaderboardData[i + 1]),
      });
    }

    return leaderboard;
  }
}
