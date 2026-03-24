import { LeaderboardEntry } from "../domain/leaderboard";

export interface LeaderboardRepository {
  getPage(page: number, limit: number): Promise<LeaderboardEntry[]>;
}
