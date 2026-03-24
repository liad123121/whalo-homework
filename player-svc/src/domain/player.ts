export interface PlayerEntity {
  playerId: string;
  username: string;
  email: string;
}

export interface CreatePlayerInput {
  username: string;
  email: string;
}

export interface UpdatePlayerInput {
  username?: string;
  email?: string;
}
