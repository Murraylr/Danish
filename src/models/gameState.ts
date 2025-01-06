import { CardType } from "./card";
import { OtherPlayer } from "./otherPlayer";

export type GameState = {
  pickupDeckNumber: number;
  players: OtherPlayer[];
  currentPlayer: OtherPlayer[];
  cardSelectingState: boolean;
  startingPlayers: string[];
  gameStarted: boolean;
  winners: OtherPlayer[];
  discardPile: CardType[];
  lastCardsPlayed: CardType[];
  bottomDiscardPile: CardType[];
};
