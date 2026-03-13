import { Request, Response } from "express";
import { LogsResponse } from "../interfaces/response-props";
import { producer } from "../events/connection";
import { EVENT_TOPICS } from "@liad123121/whalo-common";
import { LogAttrs, LogLevel } from "../models/logs";

/**
 * Handles incoming log data from clients, validates it, and sends it to the Kafka topic for processing.
 */
const sendLogs = async (req: Request, res: Response<LogsResponse>) => {
  const logs = req.body as LogAttrs;

  if (!logs.playerId || !logs.logData || logs.level === undefined) {
    return res.status(400).send({
      status: false,
      error: "Invalid request. playerId, logData, and level are required.",
    });
  }

  const logLevel = Object.values(LogLevel).includes(logs.level);

  if (isNaN(logs.level) || !logLevel) {
    return res.status(400).send({
      status: false,
      error: "Invalid log level. Level must be a number.",
    });
  }

  try {
    await producer.send({
      topic: EVENT_TOPICS.LOGS_COMMITTED,
      messages: [
        {
          value: JSON.stringify(logs),
          partition: logs.level,
        },
      ],
    });
    res
      .status(202)
      .send({ status: true, message: "Log received successfully" });
  } catch (error) {
    throw error;
  }
};

export { sendLogs };
