import { Router } from "express";
import { body } from "express-validator";
import {
  createPlayer,
  deletePlayer,
  getPlayer,
  updatePlayer,
} from "../controllers/player-controller";

const router = Router();

router.post(
  "/",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
  ],
  createPlayer,
);
router.get("/:playerId", getPlayer);
router.put(
  "/:playerId",
  [
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Valid email is required"),
  ],
  updatePlayer,
);
router.delete("/:playerId", deletePlayer);

export { router as playerRouter };
