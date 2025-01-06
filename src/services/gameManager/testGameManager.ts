import { Card, newCard } from "../../models/card";
import { GameHistoryLoader } from "../../models/gameHistoryLoader";
import { PlayingPlayer } from "../../models/player";
import { GameHistory } from "../gameHistory/gameHistory";
import { GameManager, Move, PlayAction } from "./gameManager";
import { FullGameState } from "./gameManager.spec";

export class TestGameManager extends GameManager {
  currentMove: number = 0;
  copiedGameHistory: GameHistory;

  setupTestGame(gameHistory: GameHistoryLoader, playAllMoves: boolean) {
    this.copiedGameHistory = gameHistory.gameHistory;
    this.gameHistory = new GameHistory(gameHistory.gameHistory.startingParameters, this);

    this.deck = gameHistory.gameHistory.startingParameters.deck.map((c) => newCard(c));

    for (let p of gameHistory.gameHistory.startingParameters.players) {
      let player = new PlayingPlayer(p.playerId, p.name);
      player.bestCards = p.bestCards.map((c) => newCard(c));
      player._blindCards = p._blindCards.map((c) => newCard(c));
      player._hand = p._hand.map((c) => newCard(c));
      player.inGame = true;
      this.addPlayer(player);
    }

    this.gameStarted = true;
    this.startingPlayers = [
      this.playerArray()[gameHistory.gameHistory.history[0].move.playerIndex].playerId,
    ];

    this.currentPlayerIndex = gameHistory.gameHistory.history[0].move.playerIndex;

    if (gameHistory.moveNumber > 0) {
      for (
        ;
        this.currentMove < gameHistory.moveNumber;
        this.currentMove++
      ) {
        this.playMove(gameHistory.gameHistory.history[this.currentMove].move);
      }
    }
  }

  playNextMove() {
    if (this.currentMove >= this.copiedGameHistory.history.length) {
      return;
    }

    this.playMove(this.copiedGameHistory.history[this.currentMove++].move);
  }

  private getPlayer(index: number) {
    return this.playerArray()[index];
  }

  private getCardsFromHand(number: number, amount: number) {
    return this.getPlayer(this.currentPlayerIndex)
      .hand.filter((c) => c.getNumber() === number)
      .slice(0, amount);
  }

  private onError(error: string) {
    throw new Error(error);
  }

  playMove(move: Move) {
    switch (move.action) {
      case PlayAction.Play:
        this.playCards(
          this.getPlayer(move.playerIndex),
          this.getCardsFromHand(move.cardNumber, move.cardAmount),
          this.onError
        );
        break;
      case PlayAction.Nominate:
        this.handleNomination(
          this.getPlayer(move.playerIndex),
          this.getPlayer(move.targetPlayerIndex)?.playerId
        );
        break;
      case PlayAction.PickUp:
        this.pickUpPile(this.getPlayer(move.playerIndex));
        break;
      case PlayAction.PickUpBestCards:
        break;
      case PlayAction.PickupBlindCards:
        break;
    }
  }
}
