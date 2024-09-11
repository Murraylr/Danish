import { Card } from "./card";

export type VisiblePlayer = Omit<Player, "_blindCards"> & { blindCards: number };

export class Player {
  playerId: string;
  hand: Card[];
  name: string;
  ready: boolean = false;
  connected: boolean = true;
  _blindCards: Card[] = [];
  bestCards: Card[] = [];
  nominating = false;
  nominated = false;

  constructor(playerId: string, name: string) {
    this.playerId = playerId;
    this.hand = [];
    this.name = name;
    this.connected = true;
    this._blindCards = [];
  }

  public get blindCards(): number {
    return this._blindCards.length;
  }

  public addBlindCard(card: Card) {
    this._blindCards.push(card);
  }

  addCardToHand(card: Card) {
    this.hand.push(card);
  }

  nominatePlayer(): Player {
    return this;
  }

  playCard(onCards: Card[]): Card | false {
    if (!onCards.length) {
      return this.hand.pop()!;
    }

    if (!this.hand.some((card) => card.canPlay(onCards))) {
      return false;
    }

    return this.hand.pop()!;
  }

  markReady() {
    this.ready = true;
  }

  removeCardFromHand(card: Card) {
    let index = this.hand.findIndex((c) => c.card === card.card && c.suit === card.suit);
    if (index === -1) {
      return null;
    }

    this.hand.splice(index, 1);
    return card;
  }
}
