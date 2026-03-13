import express from "express";
import "express-async-errors";
import cors from "cors";
import { gameScoreRouter } from "./routes/gamescore-router";
import notFoundHandler from "@liad123121/whalo-common/dist/middlewares/notFoundHandler";
import { errorHandler } from "@liad123121/whalo-common";

const app = express();

//plugins
app.use(cors());
app.use(express.json());

//routes
app.use("/api/scores", gameScoreRouter);
app.use("*", notFoundHandler);

app.use(errorHandler);

export default app;
