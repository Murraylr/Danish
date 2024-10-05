import {
  GameManager
} from "../services/gameManager/gameManager";
import { ChatMessage } from "./chatMessage";
import { Player } from "./player";

export class Room {
  gameManager: GameManager;
  roomName: string;
  messages: ChatMessage[] = [];
  players: Map<string, Player>;
  /**
   *
   */
  constructor(roomName: string) {
    this.gameManager = new GameManager();
    this.roomName = roomName;
    this.players = new Map();
  }

  addPlayer(player: Player) {
    this.players.set(player.playerId, player);
  }

  addSystemMessage(message: string) {
    this.messages.push({
      message,
      sender: "System",
      roomName: this.roomName,
    });
  }

  addMessage(sender: string, message: string) {
    this.messages.push({
      message,
      sender,
      roomName: this.roomName,
    });
  }

  getRoomState(): RoomState {
    return {
      messages: this.messages,
      players: Array.from(this.players.values()),
      roomName: this.roomName,
    }
  }
}

export class RoomState {
  roomName: string;
  messages: ChatMessage[] = [];
  players: Player[] = [];
}
