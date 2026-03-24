import { CreatePlayerInput, PlayerEntity, UpdatePlayerInput } from "../domain/player";

export interface PlayerRepository {
  findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<PlayerEntity | null>;
  findById(playerId: string): Promise<PlayerEntity | null>;
  create(input: CreatePlayerInput): Promise<PlayerEntity>;
  update(
    playerId: string,
    input: UpdatePlayerInput,
  ): Promise<PlayerEntity | null>;
  delete(playerId: string): Promise<PlayerEntity | null>;
}
