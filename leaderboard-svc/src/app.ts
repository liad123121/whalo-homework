import express from "express";
import "express-async-errors";
import cors from "cors";
import notFoundHandler from "@liad123121/whalo-common/dist/middlewares/notFoundHandler";
import { errorHandler } from "@liad123121/whalo-common";
import { createLeaderboardController } from "./controllers/leaderboard-controller";
import { RedisLeaderboardRepository } from "./repositories/redis-leaderboard-repository";
import { buildLeaderboardRouter } from "./routes/leaderboard-routes";
import { LeaderboardService } from "./services/leaderboard-service";

const app = express();

const leaderboardRepository = new RedisLeaderboardRepository();
const leaderboardService = new LeaderboardService(leaderboardRepository);
const leaderboardController = createLeaderboardController(leaderboardService);

app.use(cors());
app.use(express.json());

app.use("/api/leaderboard", buildLeaderboardRouter(leaderboardController));
app.use("*", notFoundHandler);

app.use(errorHandler);

export default app;
