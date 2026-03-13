import { PlayerDoc } from "../models/player";

interface ResponseSuccess {
  status: true;
  player: PlayerDoc;
}

interface ResponseError {
  status: false;
  error: string | string[];
}

export type PlayerResponse = ResponseSuccess | ResponseError;
