import { Router } from "express";
import { sendLogs } from "../controllers/logs-controller";
import { doesPlayerExist } from "@liad123121/whalo-common";

const router = Router();

router.post("/", doesPlayerExist, sendLogs);

export { router as logsRouter };
