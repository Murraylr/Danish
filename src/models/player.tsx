import { memoize, MemoizedFunction } from "lodash";
import { Card, CardType, newCard } from "./card";

export type VisiblePlayer = Omit<Player, "_blindCards" | "hand" | "getHand"> & {
  blindCards: number;
};

export class Player {
  playerId: string;
  _hand: readonly CardType[];
  name: string;
  ready: boolean = false;
  connected: boolean = true;
  _blindCards: CardType[] = [];
  bestCards: CardType[] = [];
  nominating = false;
  nominated = false;
  inGame = false;
  finished = false;
  private getHand: ((hand: readonly CardType[]) => Card[]) & MemoizedFunction;

  constructor(playerId: string, name: string) {
    this.playerId = playerId;
    this._hand = [];
    this.name = name;
    this.connected = true;
    this._blindCards = [];

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

  nominatePlayer(): Player {
    return this;
  }

  markReady() {
    this.ready = true;
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
