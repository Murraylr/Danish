import { CardType, newCard } from "../../models/card";
import { PlayingPlayer } from "../../models/player";
import { GameManager, Move } from "../gameManager/gameManager";
import { FullGameState } from "../gameManager/gameManager.spec";

export interface HistoryEntry {
  move: Move;
  gameState: FullGameState;
}

export interface StartingParameters {
  players: PlayerStartingData[];
  deck: CardType[];
}

export type PlayerStartingData = Pick<
  PlayingPlayer,
  "playerId" | "name" | "_hand" | "_blindCards" | "bestCards"
>;

export class GameHistory {
  history: HistoryEntry[] = [];
  startingParameters: StartingParameters;
  gameManager: GameManager;

  constructor(
    startingParameters: StartingParameters,
    gameManager: GameManager
  ) {
    this.startingParameters = startingParameters;
    this.gameManager = gameManager;
  }

  addHistory(move: Move) {
    let entry: HistoryEntry = {
      move,
      gameState: this.getFullGameState(),
    };
    this.history.push(entry);
  }

  private getFullGameState(): FullGameState {
    return {
      currentPlayerIndex: this.gameManager.currentPlayerIndex,
      cardSelectingState: this.gameManager.choosingBestCards,
      discardPile: this.gameManager.discardPile.map((c) => c.getNumber()),
      pickupDeckNumber: this.gameManager.deck.length,
      playerNumber: this.gameManager.playerArray().length,
      startingPlayers: this.gameManager.startingPlayers.map((s) =>
        this.gameManager.playerArray().findIndex((p) => p.playerId === s)
      ),
      winners: this.gameManager.winners.map((w) =>
        this.gameManager
          .playerArray()
          .findIndex((p) => p.playerId === w.playerId)
      ),
      players: this.gameManager.playerArray().map((p) => ({
        bestCards: p.bestCards.map((c) => newCard(c).getNumber()),
        blindCards: p._blindCards.map((c) => newCard(c).getNumber()),
        hand: p.hand.map((c) => c.getNumber()),
        nominated: p.nominated,
        nominating: p.nominating,
      })),
      deck: this.gameManager.deck.map((c) => c.getNumber()),
    };
  }
}
