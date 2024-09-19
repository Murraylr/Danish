import { Card } from "./card";

export class TestParameters {
  numPlayers: number;
  deckAmount: number;
  blindAmount: number;
  bestAmount: number;
  handAmount: number;
  discardPile: Card[];
  roomName: string;

  /**
   *
   */
  constructor(roomName: string, numPlayers: number = 2, deckAmount : number= 10, blindAmount: number = 3, bestAmount: number = 3, handAmount: number = 3, discardPile: Card[] = []) {
    this.roomName = roomName;
    this.numPlayers = numPlayers;
    this.deckAmount = deckAmount;
    this.blindAmount = blindAmount;
    this.bestAmount = bestAmount;
    this.handAmount = handAmount;
    this.discardPile = discardPile;
  }
}
