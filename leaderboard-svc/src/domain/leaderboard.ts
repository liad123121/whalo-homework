export interface LeaderboardEntry {
  playerId: string;
  score: number;
}

export interface LeaderboardQuery {
  page?: string;
  limit?: string;
}
