import {
  GameManager
} from "../services/gameManager/gameManager";
import { ChatMessage } from "./chatMessage";
import { Player, RoomPlayer } from "./player";

export class Room {
  gameManager: GameManager;
  roomName: string;
  messages: ChatMessage[] = [];
  players: Map<string, RoomPlayer>;
  /**
   *
   */
  constructor(roomName: string) {
    this.gameManager = new GameManager();
    this.roomName = roomName;
    this.players = new Map();
  }

  addPlayer(player: RoomPlayer) {
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

  markDisconnected(playerId: string) {
    let player = this.players.get(playerId);

    if (!player) {
      return;
    }

    player.connected = false;
    this.gameManager.addHistory(`${player.name} has disconnected.`);
  }

  markPlayerReady(playerId: string, isReady: boolean) {
    let player = this.players.get(playerId);

    if (!player) {
      return;
    }

    player.ready = isReady;
    this.gameManager.addHistory(`${player.name} is ${isReady ? "ready" : "not ready"}.`);
  }

  getRoomState(myId?: string): RoomState {
    return {
      myId,
      messages: this.messages,
      players: Array.from(this.players.values()),
      roomName: this.roomName,
    }
  }
}

export class RoomState {
  myId: string;
  roomName: string;
  messages: ChatMessage[] = [];
  players: RoomPlayer[] = [];
}
