import { GameManager } from "../services/gameManager/gameManager";
import { Card, newCard } from "./card";
import { OtherPlayer } from "./otherPlayer";
import { VisiblePlayer } from "./player";

export class GameState {
  discardPile: Card[] = [];
  pickupDeckNumber: number = 0;
  players: OtherPlayer[] = [];
  currentPlayer: OtherPlayer[] = [];
  cardSelectingState: boolean = false;
  startingPlayers: string[] = [];
  gameStarted: boolean = false;

  /**
   *
   */
  constructor(gameManager?: GameManager) {
    if (!gameManager) {
      return;
    }

    this.discardPile = gameManager.discardPile;
    this.pickupDeckNumber = gameManager.deck.length;
    this.players = gameManager
      .playerArray()
      .map((p) => new OtherPlayer(p, gameManager.getPlayerStatus(p.playerId)));
    this.currentPlayer = gameManager.getCurrentPlayer();
    this.cardSelectingState = gameManager.choosingBestCards;
    this.startingPlayers = gameManager.startingPlayers;
    this.gameStarted = gameManager.gameStarted;
  }
}

export function getClientState(gameState: GameState): ClientGameState {
  return Object.assign(new ClientGameState(), gameState, {
    discardPile: gameState.discardPile.map((c) => newCard(c)),
  });
}

export class ClientGameState extends GameState {
  isMyTurn(player: VisiblePlayer): boolean {
    return this.currentPlayer.some((p) => p.playerId === player.playerId);
  }

  getStatusMessage(player: VisiblePlayer): string {
    if (!this.gameStarted) {
        return "Waiting for players to click ready";
    }

    if (this.cardSelectingState) {
      return player.bestCards.length < 3 ? "Select your best cards" : "Waiting for others to select cards";
    }

    if (this.startingPlayers.includes(player.playerId)) {
      return "You have the lowest card! Play quick before someone else does!";
    }

    if (this.isMyTurn(player)) {
      if (player.nominated) {
        return "You have been nominated to play a magic card!";
      }

      if (player.nominating) {
        return "Nominate someone to play a magic card";
      }

      return "It's your turn!";
    }

    if (this.currentPlayer.length === 1) {
        return (
          "It's " +
          this.currentPlayer[0]?.name +
          "'s turn"
        );
    }

    if (this.currentPlayer.length > 1) {
      return "Waiting for " + this.currentPlayer.map((p) => p.name).join(" or ") + " to play";
    }

    return "";
  }
}
