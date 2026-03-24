import { LeaderboardEntry, LeaderboardQuery } from "../domain/leaderboard";
import { ServiceResult } from "../domain/service-result";
import { LeaderboardRepository } from "../repositories/leaderboard-repository";

export class LeaderboardService {
  constructor(private readonly repository: LeaderboardRepository) {}

  async retrieve(query: LeaderboardQuery): Promise<ServiceResult<LeaderboardEntry[]>> {
    const limit = query.limit && !Number.isNaN(parseInt(query.limit, 10))
      ? parseInt(query.limit, 10)
      : 10;
    const page = query.page && !Number.isNaN(parseInt(query.page, 10))
      ? parseInt(query.page, 10)
      : 0;

    if (limit <= 0 || page < 0) {
      return {
        ok: false,
        statusCode: 400,
        error: "Invalid pagination values",
      };
    }

    const leaderboard = await this.repository.getPage(page, limit);
    return { ok: true, data: leaderboard };
  }
}
