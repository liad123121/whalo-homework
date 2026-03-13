import express from "express";
import "express-async-errors";
import cors from "cors";
import { logsRouter } from "./routes/logs-routes";
import notFoundHandler from "@liad123121/whalo-common/dist/middlewares/notFoundHandler";
import { errorHandler } from "@liad123121/whalo-common";

const app = express();

//plugins
app.use(cors());
app.use(express.json());

//routes
app.use("/api/logs", logsRouter);
app.use("*", notFoundHandler);

app.use(errorHandler);

export default app;
