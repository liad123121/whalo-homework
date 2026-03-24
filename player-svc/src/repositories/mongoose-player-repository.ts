import { Player } from "../models/player";
import { CreatePlayerInput, PlayerEntity, UpdatePlayerInput } from "../domain/player";
import { PlayerRepository } from "./player-repository";

const toEntity = (doc: any): PlayerEntity => {
  const json = doc.toJSON();
  return {
    playerId: String(json.playerId),
    username: json.username,
    email: json.email,
  };
};

export class MongoosePlayerRepository implements PlayerRepository {
  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<PlayerEntity | null> {
    const player = await Player.findOne({ $or: [{ username }, { email }] });
    return player ? toEntity(player) : null;
  }

  async findById(playerId: string): Promise<PlayerEntity | null> {
    const player = await Player.findById(playerId);
    return player ? toEntity(player) : null;
  }

  async create(input: CreatePlayerInput): Promise<PlayerEntity> {
    const player = Player.build(input);
    await player.save();
    return toEntity(player);
  }

  async update(
    playerId: string,
    input: UpdatePlayerInput,
  ): Promise<PlayerEntity | null> {
    const player = await Player.findById(playerId);
    if (!player) {
      return null;
    }

    if (input.username) {
      player.username = input.username;
    }

    if (input.email) {
      player.email = input.email;
    }

    await player.save();
    return toEntity(player);
  }

  async delete(playerId: string): Promise<PlayerEntity | null> {
    const player = await Player.findByIdAndDelete(playerId);
    return player ? toEntity(player) : null;
  }
}
