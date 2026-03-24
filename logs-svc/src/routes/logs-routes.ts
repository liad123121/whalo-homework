import { RequestHandler, Router } from "express";
import { doesPlayerExist } from "@liad123121/whalo-common";

type LogsController = {
  sendLogs: RequestHandler;
};

export const buildLogsRouter = (controller: LogsController) => {
  const router = Router();

  router.post("/", doesPlayerExist, controller.sendLogs);

  return router;
};
