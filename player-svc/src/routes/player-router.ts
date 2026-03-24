import { RequestHandler, Router } from "express";
import { body } from "express-validator";

type PlayerController = {
  createPlayer: RequestHandler;
  getPlayer: RequestHandler;
  updatePlayer: RequestHandler;
  deletePlayer: RequestHandler;
};

export const buildPlayerRouter = (controller: PlayerController) => {
  const router = Router();

  router.post(
    "/",
    [
      body("username").trim().notEmpty().withMessage("Username is required"),
      body("email").trim().isEmail().withMessage("Valid email is required"),
    ],
    controller.createPlayer,
  );

  router.get("/:playerId", controller.getPlayer);

  router.put(
    "/:playerId",
    [
      body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),
    ],
    controller.updatePlayer,
  );

  router.delete("/:playerId", controller.deletePlayer);

  return router;
};
