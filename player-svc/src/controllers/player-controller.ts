import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Player } from "../models/player";
import { PlayerResponse } from "../interfaces/response-props";
import mongoose from "mongoose";
import { create_event, delete_event } from "../events/producers/player-events";
import { logger } from "@liad123121/whalo-common";

/**
 * Create a new player or return an existing player if one with the same username or email already exists.
 *
 * @param req - The request object containing the player's username and email.
 * @param res - The response object used to send the result back to the client.
 * @returns A response indicating the result of the player creation.
 */
const createPlayer = async (req: Request, res: Response<PlayerResponse>) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send({ status: false, error: errors.array().map((err) => err.msg) });
  }

  const { username, email } = req.body as { username: string; email: string };

  try {
    const player = await Player.findOne({
      $or: [{ username }, { email }],
    });

    if (player) {
      const { playerUsername, playerEmail, inputUsername, inputEmail } = {
        playerUsername: player.username.trim().toLowerCase(),
        playerEmail: player.email.trim().toLowerCase(),
        inputUsername: username.trim().toLowerCase(),
        inputEmail: email.trim().toLowerCase(),
      };

      if (playerUsername === inputUsername && playerEmail === inputEmail) {
        return res.status(200).send({ status: true, player });
      }

      if (playerUsername === inputUsername) {
        return res.status(400).send({
          status: false,
          error: "A player with the same username already exists",
        });
      }

      return res.status(400).send({
        status: false,
        error: "A player with the same email already exists",
      });
    }

    const newPlayer = Player.build({ username, email });
    await newPlayer.save();

    logger.info(
      `New player created with username: ${newPlayer.username} and email: ${newPlayer.email}`,
    );

    try {
      await create_event(newPlayer.toJSON().playerId);
    } catch (error) {
      logger.error("Error creating player event:", error);
    }
    return res.status(201).send({ status: true, player: newPlayer });
  } catch (error) {
    throw error;
  }
};

/**
 * Get a player by their ID.
 *
 * @param req - The request object containing the player ID.
 * @param res - The response object used to send the result back to the client.
 * @returns A response indicating the result of the player retrieval.
 */
const getPlayer = async (req: Request, res: Response<PlayerResponse>) => {
  const { playerId } = req.params as { playerId: string };

  if (!mongoose.Types.ObjectId.isValid(playerId)) {
    return res.status(404).send({ status: false, error: "Player not found" });
  }

  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).send({ status: false, error: "Player not found" });
    }

    return res.send({ status: true, player });
  } catch (error) {
    throw error;
  }
};

/**
 * Update a player's information.
 *
 * @param req - The request object containing the player ID and updated information.
 * @param res - The response object used to send the result back to the client.
 * @returns A response indicating the result of the player update.
 */
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

  if (!username && !email) {
    return res.status(400).send({
      status: false,
      error:
        "At least one field (username or email) must be provided for update",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(playerId)) {
    return res.status(404).send({ status: false, error: "Player not found" });
  }

  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).send({ status: false, error: "Player not found" });
    }

    if (username) player.username = username;
    if (email) player.email = email;

    await player.save();
    return res.send({ status: true, player });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a player by their ID.
 *
 * @param req - The request object containing the player ID.
 * @param res - The response object used to send the result back to the client.
 * @returns A response indicating the result of the player deletion.
 */
const deletePlayer = async (req: Request, res: Response<PlayerResponse>) => {
  const { playerId } = req.params as { playerId: string };

  if (!mongoose.Types.ObjectId.isValid(playerId)) {
    return res.status(404).send({ status: false, error: "Player not found" });
  }

  try {
    const player = await Player.findByIdAndDelete(playerId);
    if (!player) {
      return res.status(404).send({ status: false, error: "Player not found" });
    }

    try {
      await delete_event(playerId);
    } catch (error) {
      logger.error("Error deleting player event:", error);
    }

    return res.send({ status: true, player });
  } catch (error) {
    throw error;
  }
};

export { createPlayer, getPlayer, updatePlayer, deletePlayer };
