import test from "node:test";
import assert from "node:assert/strict";
import { ScoreEntity } from "../src/domain/score";
import { ScoreEventsPublisher } from "../src/events/score-events-publisher";
import { ScoreRepository } from "../src/repositories/score-repository";
import { GamescoreService } from "../src/services/gamescore-service";

class InMemoryScoreRepository implements ScoreRepository {
  private readonly scores: ScoreEntity[] = [];

  async create(input: { playerId: string; score: number }): Promise<ScoreEntity> {
    const entity: ScoreEntity = {
      id: `s${this.scores.length + 1}`,
      playerId: input.playerId,
      score: input.score,
    };

    this.scores.push(entity);
    return entity;
  }

  async findTop(limit: number): Promise<ScoreEntity[]> {
    return [...this.scores].sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

class FakeScoreEventsPublisher implements ScoreEventsPublisher {
  public published: Array<{ playerId: string; score: number }> = [];

  async publishScoreSubmitted(playerId: string, score: number): Promise<void> {
    this.published.push({ playerId, score });
  }
}

test("submits score and publishes event", async () => {
  const repository = new InMemoryScoreRepository();
  const publisher = new FakeScoreEventsPublisher();
  const service = new GamescoreService(repository, publisher);

  const result = await service.submit({ playerId: "p1", score: 23 });
  assert.equal(result.ok, true);
  assert.equal(publisher.published.length, 1);
});

test("returns top scores", async () => {
  const repository = new InMemoryScoreRepository();
  const publisher = new FakeScoreEventsPublisher();
  const service = new GamescoreService(repository, publisher);

  await service.submit({ playerId: "p1", score: 10 });
  await service.submit({ playerId: "p2", score: 30 });

  const result = await service.topScores(10);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data[0]?.playerId, "p2");
  }
});
