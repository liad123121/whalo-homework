import { logger } from "@liad123121/whalo-common";
import { CreatePlayerInput, PlayerEntity, UpdatePlayerInput } from "../domain/player";
import { ServiceResult } from "../domain/service-result";
import { PlayerEventsPublisher } from "../events/player-events-publisher";
import { PlayerRepository } from "../repositories/player-repository";

export interface IdValidator {
  isValid(id: string): boolean;
}

export class PlayerService {
  constructor(
    private readonly repository: PlayerRepository,
    private readonly eventsPublisher: PlayerEventsPublisher,
    private readonly idValidator: IdValidator,
  ) {}

  async create(input: CreatePlayerInput): Promise<ServiceResult<PlayerEntity>> {
    const existing = await this.repository.findByUsernameOrEmail(
      input.username,
      input.email,
    );

    if (existing) {
      const existingUsername = existing.username.trim().toLowerCase();
      const existingEmail = existing.email.trim().toLowerCase();
      const inputUsername = input.username.trim().toLowerCase();
      const inputEmail = input.email.trim().toLowerCase();

      if (existingUsername === inputUsername && existingEmail === inputEmail) {
        return { ok: true, data: existing };
      }

      if (existingUsername === inputUsername) {
        return {
          ok: false,
          statusCode: 400,
          error: "A player with the same username already exists",
        };
      }

      return {
        ok: false,
        statusCode: 400,
        error: "A player with the same email already exists",
      };
    }

    const player = await this.repository.create(input);

    logger.info(
      `New player created with username: ${player.username} and email: ${player.email}`,
    );

    try {
      await this.eventsPublisher.publishPlayerCreated(player.playerId);
    } catch (error) {
      logger.error("Error creating player event:", error);
    }

    return { ok: true, data: player };
  }

  async getById(playerId: string): Promise<ServiceResult<PlayerEntity>> {
    if (!this.idValidator.isValid(playerId)) {
      return { ok: false, statusCode: 404, error: "Player not found" };
    }

    const player = await this.repository.findById(playerId);
    if (!player) {
      return { ok: false, statusCode: 404, error: "Player not found" };
    }

    return { ok: true, data: player };
  }

  async update(
    playerId: string,
    input: UpdatePlayerInput,
  ): Promise<ServiceResult<PlayerEntity>> {
    if (!input.username && !input.email) {
      return {
        ok: false,
        statusCode: 400,
        error: "At least one field (username or email) must be provided for update",
      };
    }

    if (!this.idValidator.isValid(playerId)) {
      return { ok: false, statusCode: 404, error: "Player not found" };
    }

    const updated = await this.repository.update(playerId, input);
    if (!updated) {
      return { ok: false, statusCode: 404, error: "Player not found" };
    }

    return { ok: true, data: updated };
  }

  async delete(playerId: string): Promise<ServiceResult<PlayerEntity>> {
    if (!this.idValidator.isValid(playerId)) {
      return { ok: false, statusCode: 404, error: "Player not found" };
    }

    const deleted = await this.repository.delete(playerId);
    if (!deleted) {
      return { ok: false, statusCode: 404, error: "Player not found" };
    }

    try {
      await this.eventsPublisher.publishPlayerDeleted(playerId);
    } catch (error) {
      logger.error("Error deleting player event:", error);
    }

    return { ok: true, data: deleted };
  }
}
