import { LogEntryInput } from "../domain/log";
import { ServiceResult } from "../domain/service-result";
import { LogEventsPublisher } from "../events/log-events-publisher";
import { LogLevel } from "../models/logs";

export class LogsService {
  constructor(private readonly eventsPublisher: LogEventsPublisher) {}

  async send(log: LogEntryInput): Promise<ServiceResult<{ message: string }>> {
    if (!log.playerId || !log.logData || log.level === undefined) {
      return {
        ok: false,
        statusCode: 400,
        error: "Invalid request. playerId, logData, and level are required.",
      };
    }

    const logLevel = Object.values(LogLevel).includes(log.level);
    if (Number.isNaN(log.level) || !logLevel) {
      return {
        ok: false,
        statusCode: 400,
        error: "Invalid log level. Level must be a number.",
      };
    }

    await this.eventsPublisher.publish(log);

    return {
      ok: true,
      data: { message: "Log received successfully" },
    };
  }
}
