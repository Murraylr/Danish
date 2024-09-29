import { ChatMessage } from "../models/chatMessage";
import { GameState } from "../models/gameState";
import { OtherPlayer } from "../models/otherPlayer";
import { Room } from "../models/room";
import { ReduxPlayerState } from "./playerState/playerStateSlice";
import { WinnerState } from "./winnerStateSlice/winnerStateSlice";

export interface State {
  gameState: GameState;
  playerState: ReduxPlayerState;
  room: Room;
  messages: ChatMessage[];
  winners: WinnerState;
}
