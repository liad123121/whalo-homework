import express from "express";
import "express-async-errors";
import cors from "cors";
import notFoundHandler from "@liad123121/whalo-common/dist/middlewares/notFoundHandler";
import { errorHandler } from "@liad123121/whalo-common";
import { createGamescoreController } from "./controllers/gamescore-conteroller";
import { KafkaScoreEventsPublisher } from "./events/score-events-publisher";
import { MongooseScoreRepository } from "./repositories/mongoose-score-repository";
import { buildGamescoreRouter } from "./routes/gamescore-router";
import { GamescoreService } from "./services/gamescore-service";

const app = express();

const scoreRepository = new MongooseScoreRepository();
const scoreEventsPublisher = new KafkaScoreEventsPublisher();
const gamescoreService = new GamescoreService(scoreRepository, scoreEventsPublisher);
const gamescoreController = createGamescoreController(gamescoreService);

app.use(cors());
app.use(express.json());

app.use("/api/scores", buildGamescoreRouter(gamescoreController));
app.use("*", notFoundHandler);

app.use(errorHandler);

export default app;
