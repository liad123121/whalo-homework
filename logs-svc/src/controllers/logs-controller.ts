import { Request, Response } from "express";
import { LogsResponse } from "../interfaces/response-props";
import { LogAttrs } from "../models/logs";
import { LogsService } from "../services/logs-service";

export const createLogsController = (logsService: LogsService) => {
  const sendLogs = async (req: Request, res: Response<LogsResponse>) => {
    const logs = req.body as LogAttrs;
    const result = await logsService.send(logs);

    if (!result.ok) {
      return res.status(result.statusCode).send({ status: false, error: result.error });
    }

    return res.status(202).send({ status: true, message: result.data.message });
  };

  return { sendLogs };
};
