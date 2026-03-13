export interface LeaderboardEntry {
  playerId: string;
  score: number;
}

interface SubmitLeaderboardResponseSuccess {
  status: true;
  leaderboard: LeaderboardEntry[];
}

interface ResponseError {
  status: false;
  error: string;
}

export type LeaderboardResponse =
  | SubmitLeaderboardResponseSuccess
  | ResponseError;
