import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PlayerResponse } from "../interfaces/response-props";
import { PlayerService } from "../services/player-service";

export const createPlayerController = (playerService: PlayerService) => {
  const createPlayer = async (req: Request, res: Response<PlayerResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: false, error: errors.array().map((err) => err.msg) });
    }

    const { username, email } = req.body as { username: string; email: string };
    const result = await playerService.create({ username, email });

    if (!result.ok) {
      return res.status(result.statusCode).send({ status: false, error: result.error });
    }

    return res.status(201).send({ status: true, player: result.data });
  };

  const getPlayer = async (req: Request, res: Response<PlayerResponse>) => {
    const { playerId } = req.params as { playerId: string };
    const result = await playerService.getById(playerId);

    if (!result.ok) {
      return res.status(result.statusCode).send({ status: false, error: result.error });
    }

    return res.send({ status: true, player: result.data });
  };

  const updatePlayer = async (req: Request, res: Response<PlayerResponse>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        status: false,
        error: errors.array()[0]?.msg || "Invalid input",
      });
    }

    const { playerId } = req.params as { playerId: string };
    const { username, email } = req.body as { username?: string; email?: string };
    const updateInput: { username?: string; email?: string } = {};

    if (username !== undefined) {
      updateInput.username = username;
    }

    if (email !== undefined) {
      updateInput.email = email;
    }

    const result = await playerService.update(playerId, updateInput);

    if (!result.ok) {
      return res.status(result.statusCode).send({ status: false, error: result.error });
    }

    return res.send({ status: true, player: result.data });
  };

  const deletePlayer = async (req: Request, res: Response<PlayerResponse>) => {
    const { playerId } = req.params as { playerId: string };
    const result = await playerService.delete(playerId);

    if (!result.ok) {
      return res.status(result.statusCode).send({ status: false, error: result.error });
    }

    return res.send({ status: true, player: result.data });
  };

  return { createPlayer, getPlayer, updatePlayer, deletePlayer };
};
