import { RequestHandler, Router } from "express";
import { doesPlayerExist } from "@liad123121/whalo-common";

type GamescoreController = {
  submitScore: RequestHandler;
  topScores: RequestHandler;
};

export const buildGamescoreRouter = (controller: GamescoreController) => {
  const router = Router();

  router.post("/", doesPlayerExist, controller.submitScore);
  router.get("/top", controller.topScores);

  return router;
};
