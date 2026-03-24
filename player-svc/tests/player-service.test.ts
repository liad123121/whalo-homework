import test from "node:test";
import assert from "node:assert/strict";
import { PlayerEntity } from "../src/domain/player";
import { PlayerEventsPublisher } from "../src/events/player-events-publisher";
import { PlayerRepository } from "../src/repositories/player-repository";
import { PlayerService } from "../src/services/player-service";

class InMemoryPlayerRepository implements PlayerRepository {
  private readonly players = new Map<string, PlayerEntity>();

  async findByUsernameOrEmail(username: string, email: string): Promise<PlayerEntity | null> {
    for (const player of this.players.values()) {
      if (player.username === username || player.email === email) {
        return player;
      }
    }

    return null;
  }

  async findById(playerId: string): Promise<PlayerEntity | null> {
    return this.players.get(playerId) ?? null;
  }

  async create(input: { username: string; email: string }): Promise<PlayerEntity> {
    const created: PlayerEntity = {
      playerId: "p1",
      username: input.username,
      email: input.email,
    };
    this.players.set(created.playerId, created);
    return created;
  }

  async update(playerId: string, input: { username?: string; email?: string }): Promise<PlayerEntity | null> {
    const current = this.players.get(playerId);
    if (!current) {
      return null;
    }

    const updated: PlayerEntity = {
      ...current,
      ...input,
    };

    this.players.set(playerId, updated);
    return updated;
  }

  async delete(playerId: string): Promise<PlayerEntity | null> {
    const current = this.players.get(playerId);
    if (!current) {
      return null;
    }

    this.players.delete(playerId);
    return current;
  }
}

class FakePlayerEventsPublisher implements PlayerEventsPublisher {
  public createdEventIds: string[] = [];
  public deletedEventIds: string[] = [];

  async publishPlayerCreated(playerId: string): Promise<void> {
    this.createdEventIds.push(playerId);
  }

  async publishPlayerDeleted(playerId: string): Promise<void> {
    this.deletedEventIds.push(playerId);
  }
}

const validId = "507f1f77bcf86cd799439011";

test("creates a player and publishes player.created", async () => {
  const repository = new InMemoryPlayerRepository();
  const publisher = new FakePlayerEventsPublisher();

  const service = new PlayerService(repository, publisher, {
    isValid: () => true,
  });

  const result = await service.create({
    username: "liad",
    email: "liad@example.com",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.username, "liad");
  }
  assert.deepEqual(publisher.createdEventIds, ["p1"]);
});

test("returns 404 when id is invalid", async () => {
  const repository = new InMemoryPlayerRepository();
  const publisher = new FakePlayerEventsPublisher();

  const service = new PlayerService(repository, publisher, {
    isValid: () => false,
  });

  const result = await service.getById("invalid-id");
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.statusCode, 404);
  }
});

test("deletes a player and publishes player.deleted", async () => {
  const repository = new InMemoryPlayerRepository();
  const publisher = new FakePlayerEventsPublisher();
  await repository.create({ username: "liad", email: "liad@example.com" });

  const service = new PlayerService(repository, publisher, {
    isValid: (id) => id === validId || id === "p1",
  });

  const result = await service.delete("p1");
  assert.equal(result.ok, true);
  assert.deepEqual(publisher.deletedEventIds, ["p1"]);
});
