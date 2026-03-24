import { PlayerEntity } from "../domain/player";

interface ResponseSuccess {
  status: true;
  player: PlayerEntity;
}

interface ResponseError {
  status: false;
  error: string | string[];
}

export type PlayerResponse = ResponseSuccess | ResponseError;
