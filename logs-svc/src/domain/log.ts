import { LogLevel } from "../models/logs";

export interface LogEntryInput {
  playerId: string;
  logData: string;
  level: LogLevel;
}
