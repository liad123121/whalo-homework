import { RequestHandler, Router } from "express";

type LeaderboardController = {
  retrieveLeaderboard: RequestHandler;
};

export const buildLeaderboardRouter = (controller: LeaderboardController) => {
  const router = Router();

  router.get("/players/leaderboard", controller.retrieveLeaderboard);

  return router;
};
