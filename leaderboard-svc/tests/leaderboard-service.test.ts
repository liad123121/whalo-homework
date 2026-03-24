import test from "node:test";
import assert from "node:assert/strict";
import { LeaderboardEntry } from "../src/domain/leaderboard";
import { LeaderboardRepository } from "../src/repositories/leaderboard-repository";
import { LeaderboardService } from "../src/services/leaderboard-service";

class FakeLeaderboardRepository implements LeaderboardRepository {
  async getPage(_page: number, _limit: number): Promise<LeaderboardEntry[]> {
    return [
      { playerId: "p1", score: 100 },
      { playerId: "p2", score: 50 },
    ];
  }
}

test("returns leaderboard entries", async () => {
  const service = new LeaderboardService(new FakeLeaderboardRepository());
  const result = await service.retrieve({ page: "0", limit: "10" });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.length, 2);
  }
});

test("returns validation error for negative page", async () => {
  const service = new LeaderboardService(new FakeLeaderboardRepository());
  const result = await service.retrieve({ page: "-1", limit: "10" });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.statusCode, 400);
  }
});
