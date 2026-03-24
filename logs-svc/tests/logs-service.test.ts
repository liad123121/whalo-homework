import test from "node:test";
import assert from "node:assert/strict";
import { LogEntryInput } from "../src/domain/log";
import { LogEventsPublisher } from "../src/events/log-events-publisher";
import { LogsService } from "../src/services/logs-service";
import { LogLevel } from "../src/models/logs";

class FakeLogEventsPublisher implements LogEventsPublisher {
  public published: LogEntryInput[] = [];

  async publish(log: LogEntryInput): Promise<void> {
    this.published.push(log);
  }
}

test("accepts valid log and publishes event", async () => {
  const publisher = new FakeLogEventsPublisher();
  const service = new LogsService(publisher);

  const result = await service.send({
    playerId: "p1",
    logData: "client failed to reconnect",
    level: LogLevel.CRITICAL,
  });

  assert.equal(result.ok, true);
  assert.equal(publisher.published.length, 1);
});

test("rejects invalid log level", async () => {
  const publisher = new FakeLogEventsPublisher();
  const service = new LogsService(publisher);

  const result = await service.send({
    playerId: "p1",
    logData: "hello",
    level: 99 as unknown as LogLevel,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.statusCode, 400);
  }
});
