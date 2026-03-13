import { Request, Response, NextFunction } from "express";
import { redisClient } from "../db/redis";
import { SHARED_REDIS_KEYS } from "../constants";

export const doesPlayerExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { playerId } = req.body as { playerId: string };

  if (!playerId) {
    return res.status(400).send({
      status: false,
      error: "playerId is required",
    });
  }

  const existingPlayer = await redisClient.sismember(
    SHARED_REDIS_KEYS.ACTIVE_PLAYERS,
    playerId,
  );

  if (!existingPlayer) {
    return res.status(404).send({
      status: false,
      error: "Player not found",
    });
  }

  next();
};
