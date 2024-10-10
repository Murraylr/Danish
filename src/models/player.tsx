import { memoize, MemoizedFunction } from "lodash";
import { Card, CardType, newCard } from "./card";

export type VisiblePlayer = Omit<PlayingPlayer & RoomPlayer, "_blindCards" | "hand" | "getHand"> & {
  blindCards: number;
};

export abstract class Player {
  playerId: string;
  name: string;
  inGame = false;

  constructor(playerId: string, name: string) {
    this.playerId = playerId;
    this.name = name;
  }
}

export class RoomPlayer extends Player {
  ready: boolean = false;
  connected: boolean = true;

  /**
   *
   */
  constructor(playerId: string, name: string) {
    super(playerId, name);
    this.connected = true;
  }

  markReady() {
    this.ready = true;
  }
}

export class PlayingPlayer extends Player {
  _hand: readonly CardType[];
  _blindCards: CardType[] = [];
  bestCards: CardType[] = [];
  nominating = false;
  nominated = false;
  finished = false;
  private getHand: ((hand: readonly CardType[]) => Card[]) & MemoizedFunction;

  constructor(playerId: string, name: string) {
    super(playerId, name);
    this._blindCards = [];
    this._hand = [];

    this.getHand = memoize((hand: CardType[]) =>
      hand.map((card) => newCard(card))
    );
  }

  public get blindCards(): number {
    return this._blindCards.length;
  }

  public get hand(): readonly Card[] {
    return this.getHand(this._hand);
  }

  public addBlindCard(card: Card) {
    this._blindCards.push(card);
  }

  addCardToHand(card: Card) {
    this._hand = [...this._hand, card];
  }

  nominatePlayer(): PlayingPlayer {
    return this;
  }

  removeCardFromHand(card: Card) {
    let index = this.hand.findIndex(
      (c) => c.card === card.card && c.suit === card.suit
    );
    if (index === -1) {
      return null;
    }

    this._hand = [...this._hand.slice(0, index), ...this._hand.slice(index + 1)];
    return card;
  }
}
