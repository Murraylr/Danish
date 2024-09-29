import { last } from "lodash";
import { GameManager, HistoryEntry } from "../services/gameManager/gameManager";
import { Card, CardType, newCard } from "./card";
import { OtherPlayer } from "./otherPlayer";
import { Player, VisiblePlayer } from "./player";

export type GameState = {
  pickupDeckNumber: number;
  players: OtherPlayer[];
  currentPlayer: OtherPlayer[];
  cardSelectingState: boolean;
  startingPlayers: string[];
  gameStarted: boolean;
  history: HistoryEntry[];
  winners: OtherPlayer[];
  discardPile: CardType[];
  lastCardsPlayed: CardType[];
  bottomDiscardPile: CardType[];
};

