import express from "express";
import "express-async-errors";
import cors from "cors";
import mongoose from "mongoose";
import notFoundHandler from "@liad123121/whalo-common/dist/middlewares/notFoundHandler";
import { errorHandler } from "@liad123121/whalo-common";
import { createPlayerController } from "./controllers/player-controller";
import { KafkaPlayerEventsPublisher } from "./events/player-events-publisher";
import { MongoosePlayerRepository } from "./repositories/mongoose-player-repository";
import { buildPlayerRouter } from "./routes/player-router";
import { PlayerService } from "./services/player-service";

const app = express();

const playerRepository = new MongoosePlayerRepository();
const playerEventsPublisher = new KafkaPlayerEventsPublisher();
const playerService = new PlayerService(playerRepository, playerEventsPublisher, {
  isValid: (id: string) => mongoose.Types.ObjectId.isValid(id),
});
const playerController = createPlayerController(playerService);

app.use(cors());
app.use(express.json());

app.use("/api/players", buildPlayerRouter(playerController));
app.use("*", notFoundHandler);

app.use(errorHandler);

export default app;
