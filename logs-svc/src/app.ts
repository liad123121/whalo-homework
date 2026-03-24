import express from "express";
import "express-async-errors";
import cors from "cors";
import notFoundHandler from "@liad123121/whalo-common/dist/middlewares/notFoundHandler";
import { errorHandler } from "@liad123121/whalo-common";
import { createLogsController } from "./controllers/logs-controller";
import { KafkaLogEventsPublisher } from "./events/log-events-publisher";
import { buildLogsRouter } from "./routes/logs-routes";
import { LogsService } from "./services/logs-service";

const app = express();

const logsEventsPublisher = new KafkaLogEventsPublisher();
const logsService = new LogsService(logsEventsPublisher);
const logsController = createLogsController(logsService);

app.use(cors());
app.use(express.json());

app.use("/api/logs", buildLogsRouter(logsController));
app.use("*", notFoundHandler);

app.use(errorHandler);

export default app;
