import { Router } from "express";
import { retrieveLeaderboard } from "../controllers/leaderboard-controller";

const router = Router();

router.get("/players/leaderboard", retrieveLeaderboard);

export { router as leaderboardRouter };
