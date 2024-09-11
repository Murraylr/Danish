import { ChatMessage } from "../models/chatMessage";
import { ClientGameState } from "../models/gameState";
import { PlayerState } from "../models/playerUpdate";
import { Room } from "../models/room";

export interface State {
  gameState: ClientGameState;
  playerState: PlayerState;
  room: Room;
  messages: ChatMessage[];
}
