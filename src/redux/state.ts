import { ChatMessage } from "../models/chatMessage";
import { ClientGameState } from "../models/gameState";
import { PlayerState } from "../models/playerUpdate";
import { Room } from "../models/room";
import { ReduxPlayerState } from "./playerState/playerStateSlice";

export interface State {
  gameState: ClientGameState;
  playerState: ReduxPlayerState;
  room: Room;
  messages: ChatMessage[];
}
