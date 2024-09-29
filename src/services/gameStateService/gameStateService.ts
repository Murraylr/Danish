import { Card } from "../../models/card";
import { GameState } from "../../models/gameState";
import { OtherPlayer } from "../../models/otherPlayer";
import { VisiblePlayer } from "../../models/player";

export class GameStateService {
  private gameState: GameState | null;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  isMyTurn(player: VisiblePlayer): boolean {
    return this.gameState?.currentPlayer.some(
      (p) => p.playerId === player.playerId
    );
  }

  isPlayerTurn(player: OtherPlayer): boolean {
    return this.gameState?.currentPlayer.some(
      (p) => p.playerId === player.playerId
    );
  }

  getStatusMessage(player: VisiblePlayer): string {
    if (!this.gameState?.gameStarted) {
      return "Waiting for players to click ready";
    }

    if (this.gameState?.cardSelectingState) {
      return player.bestCards.length < 3
        ? "Select your best cards"
        : "Waiting for others to select cards";
    }

    if (this.gameState?.startingPlayers.includes(player.playerId)) {
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

    if (this.gameState?.currentPlayer.length === 1) {
      return "It's " + this.gameState?.currentPlayer[0]?.name + "'s turn";
    }

    if (this.gameState?.currentPlayer.length > 1) {
      return (
        "Waiting for " +
        this.gameState?.currentPlayer.map((p) => p.name).join(" or ") +
        " to play"
      );
    }

    return "";
  }
}
