import { Router } from "express";
import { submitScore, topScores } from "../controllers/gamescore-conteroller";
import { doesPlayerExist } from "@liad123121/whalo-common";

const router = Router();

router.post("/", doesPlayerExist, submitScore);
router.get("/top", topScores);

export { router as gameScoreRouter };
