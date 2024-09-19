import {
  GameManager,
  GameManagerTester,
} from "../services/gameManager/gameManager";
import { ChatMessage } from "./chatMessage";
import { Player } from "./player";

export class Room {
  gameManager: GameManager;
  roomName: string;
  messages: ChatMessage[] = [];
  /**
   *
   */
  constructor(roomName: string) {
    this.gameManager = new GameManager();
    this.roomName = roomName;
  }

  addPlayer(player: Player) {
    this.gameManager.addPlayer(player);
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
}
