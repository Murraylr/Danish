import React from "react";
import AceOfSpades from "../components/cardImages/spades_ace";
import TwoOfSpades from "../components/cardImages/spades_2";
import ThreeOfSpades from "../components/cardImages/spades_3";
import FourOfSpades from "../components/cardImages/spades_4";
import FiveOfSpades from "../components/cardImages/spades_5";
import SixOfSpades from "../components/cardImages/spades_6";
import SevenOfSpades from "../components/cardImages/spades_7";
import EightOfSpades from "../components/cardImages/spades_8";
import NineOfSpades from "../components/cardImages/spades_9";
import TenOfSpades from "../components/cardImages/spades_10";
import JackOfSpades from "../components/cardImages/spades_jack";
import QueenOfSpades from "../components/cardImages/spades_queen";
import KingOfSpades from "../components/cardImages/spades_king";
import AceOfHearts from "../components/cardImages/hearts_ace";
import TwoOfHearts from "../components/cardImages/hearts_2";
import ThreeOfHearts from "../components/cardImages/hearts_3";
import FourOfHearts from "../components/cardImages/hearts_4";
import FiveOfHearts from "../components/cardImages/hearts_5";
import SixOfHearts from "../components/cardImages/hearts_6";
import SevenOfHearts from "../components/cardImages/hearts_7";
import EightOfHearts from "../components/cardImages/hearts_8";
import NineOfHearts from "../components/cardImages/hearts_9";
import TenOfHearts from "../components/cardImages/hearts_10";
import JackOfHearts from "../components/cardImages/hearts_jack";
import QueenOfHearts from "../components/cardImages/hearts_queen";
import KingOfHearts from "../components/cardImages/hearts_king";
import AceOfClubs from "../components/cardImages/clubs_ace";
import TwoOfClubs from "../components/cardImages/clubs_2";
import ThreeOfClubs from "../components/cardImages/clubs_3";
import FourOfClubs from "../components/cardImages/clubs_4";
import FiveOfClubs from "../components/cardImages/clubs_5";
import SixOfClubs from "../components/cardImages/clubs_6";
import SevenOfClubs from "../components/cardImages/clubs_7";
import EightOfClubs from "../components/cardImages/clubs_8";
import NineOfClubs from "../components/cardImages/clubs_9";
import TenOfClubs from "../components/cardImages/clubs_10";
import JackOfClubs from "../components/cardImages/clubs_jack";
import QueenOfClubs from "../components/cardImages/clubs_queen";
import KingOfClubs from "../components/cardImages/clubs_king";
import AceOfDiamonds from "../components/cardImages/diamonds_ace";
import TwoOfDiamonds from "../components/cardImages/diamonds_2";
import ThreeOfDiamonds from "../components/cardImages/diamonds_3";
import FourOfDiamonds from "../components/cardImages/diamonds_4";
import FiveOfDiamonds from "../components/cardImages/diamonds_5";
import SixOfDiamonds from "../components/cardImages/diamonds_6";
import SevenOfDiamonds from "../components/cardImages/diamonds_7";
import EightOfDiamonds from "../components/cardImages/diamonds_8";
import NineOfDiamonds from "../components/cardImages/diamonds_9";
import TenOfDiamonds from "../components/cardImages/diamonds_10";
import JackOfDiamonds from "../components/cardImages/diamonds_jack";
import QueenOfDiamonds from "../components/cardImages/diamonds_queen";
import KingOfDiamonds from "../components/cardImages/diamonds_king";

export enum CardNumber {
  Ace = "Ace",
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = "Jack",
  Queen = "Queen",
  King = "King",
}

export enum Suit {
  Clubs = "Clubs",
  Diamonds = "Diamonds",
  Hearts = "Hearts",
  Spades = "Spades",
}

export enum CardEvent {
  Next,
  Nominate,
  DiscardPile,
  Back,
}

export class Card {
  card!: CardNumber;
  suit: Suit;
  isMagicCard: boolean;
  isPowerCard: boolean;
  isSelected: boolean = false;

  /**
   *
   */
  constructor(suit: Suit) {
    this.isMagicCard = false;
    this.isPowerCard = false;
    this.suit = suit;
  }

  getNumber(): number {
    if (typeof this.card === "number" && !!this.card) {
      return this.card as number;
    }

    return 0;
  }

  getName(): string {
    return this.card.toString();
  }

  canPlay(onCards: Card[], onFailCallback?: (message: string) => void) {
    let topCard = this.getTopCard(onCards);
    if (topCard === null) {
      return true;
    }

    if (this.isNominating(onCards)) {
      if (!this.isMagicCard) {
        onFailCallback &&
          onFailCallback("You have been nominated to play a magic card.");
        return false;
      }
      console.log("Player is nominated, playing ", this.card);
      return this.isMagicCard;
    }

    if (topCard.card === CardNumber.Seven || topCard.card === CardNumber.Nine) {
      let canPlay = this.getNumber() <= topCard.getNumber();
      console.log("Top card is power card, playing ", this.card);
      if (!canPlay && onFailCallback) {
        onFailCallback(
          `Cannot play a ${this.getName()} on a ${topCard.getName()}. You must play lower or equal.`
        );
      }
      return canPlay;
    }

    console.log("Playing ", this.card, " on top card: ", topCard.card);
    let canPlay = this.getNumber() >= topCard.getNumber();
    if (!canPlay && onFailCallback) {
      onFailCallback(
        `Cannot play a ${this.getName()} on a ${topCard.getName()}. You must play higher or equal or a magic card.`
      );
    }
    return canPlay;
  }

  getTopCard(onCards: Card[]): Card | null {
    if (!onCards.length) {
      return null;
    }

    let cardIndex = onCards.length - 1;
    let card: Card = onCards[cardIndex];

    while (cardIndex >= 0 && card.card === CardNumber.Eight) {
      cardIndex--;
      card = onCards[cardIndex];
    }

    return card ?? onCards[onCards.length - 1];
  }

  isNominating(onCards: Card[]): boolean {
    if (onCards.length === 0) {
      return true;
    }

    let topCard = this.getTopCard(onCards);
    if (topCard.card !== CardNumber.Ace) {
      return false;
    }

    return !(topCard as Ace).isOne;
  }

  render() {
    return <div></div>;
  }
}

export class Ace extends Card {
  constructor(suit: Suit, isOne: boolean = false) {
    super(suit);
    this.card = CardNumber.Ace;
    this.isMagicCard = true;
    this.isOne = isOne;
  }
  isMagicCard: boolean = true;
  isPowerCard: boolean = false;
  card: CardNumber;
  isOne: boolean = false;
  canPlay() {
    return true;
  }

  getNumber(): number {
    return 1;
  }

  nextPlayer() {
    return CardEvent.Nominate;
  }

  render() {
    switch (this.suit) {
      case Suit.Clubs:
        return <AceOfClubs />;
      case Suit.Diamonds:
        return <AceOfDiamonds />;
      case Suit.Hearts:
        return <AceOfHearts />;
      case Suit.Spades:
        return <AceOfSpades />;
    }
  }
}

export class Two extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Two;
    this.isMagicCard = true;
  }

  canPlay(): boolean {
    return true;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <TwoOfClubs />;
      case Suit.Diamonds:
        return <TwoOfDiamonds />;
      case Suit.Hearts:
        return <TwoOfHearts />;
      case Suit.Spades:
        return <TwoOfSpades />;
    }
  }
}

export class Three extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Three;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <ThreeOfClubs />;
      case Suit.Diamonds:
        return <ThreeOfDiamonds />;
      case Suit.Hearts:
        return <ThreeOfHearts />;
      case Suit.Spades:
        return <ThreeOfSpades />;
    }
  }
}

export class Four extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Four;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <FourOfClubs />;
      case Suit.Diamonds:
        return <FourOfDiamonds />;
      case Suit.Hearts:
        return <FourOfHearts />;
      case Suit.Spades:
        return <FourOfSpades />;
    }
  }
}

export class Five extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Five;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <FiveOfClubs />;
      case Suit.Diamonds:
        return <FiveOfDiamonds />;
      case Suit.Hearts:
        return <FiveOfHearts />;
      case Suit.Spades:
        return <FiveOfSpades />;
    }
  }
}

export class Six extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Six;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <SixOfClubs />;
      case Suit.Diamonds:
        return <SixOfDiamonds />;
      case Suit.Hearts:
        return <SixOfHearts />;
      case Suit.Spades:
        return <SixOfSpades />;
    }
  }
}

export class Seven extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Seven;
    this.isPowerCard = true;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <SevenOfClubs />;
      case Suit.Diamonds:
        return <SevenOfDiamonds />;
      case Suit.Hearts:
        return <SevenOfHearts />;
      case Suit.Spades:
        return <SevenOfSpades />;
    }
  }
}

export class Eight extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Eight;
    this.isMagicCard = true;
  }

  canPlay(onCards: Card[], onFailCallback?: (errorMessage: string) => void): boolean {
    let topCard = this.getTopCard(onCards);
    if (topCard === null) {
      return true;
    }
    if (topCard.card === CardNumber.Seven) {
      onFailCallback('Cannot play an 8 on a 7. Must be lower or equal to a 7.');
      return false;
    }

    return true;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <EightOfClubs />;
      case Suit.Diamonds:
        return <EightOfDiamonds />;
      case Suit.Hearts:
        return <EightOfHearts />;
      case Suit.Spades:
        return <EightOfSpades />;
    }
  }
}

export class Nine extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Nine;
    this.isPowerCard = true;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <NineOfClubs />;
      case Suit.Diamonds:
        return <NineOfDiamonds />;
      case Suit.Hearts:
        return <NineOfHearts />;
      case Suit.Spades:
        return <NineOfSpades />;
    }
  }
}

export class Ten extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Ten;
    this.isMagicCard = true;
  }

  canPlay(onCards: Card[], onFailCallback?: (errorMessage: string) => void): boolean {
    let topCard = this.getTopCard(onCards);
    if (topCard === null) {
      return true;
    }

    if (topCard.card === CardNumber.Seven || topCard.card === CardNumber.Ten) {
      onFailCallback('Cannot play a 10 on a 7 or a 9. Must be lower than or equal.');
      return false;
    }

    return true;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <TenOfClubs />;
      case Suit.Diamonds:
        return <TenOfDiamonds />;
      case Suit.Hearts:
        return <TenOfHearts />;
      case Suit.Spades:
        return <TenOfSpades />;
    }
  }
}

export class Jack extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Jack;
  }

  getNumber(): number {
    return 11;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <JackOfClubs />;
      case Suit.Diamonds:
        return <JackOfDiamonds />;
      case Suit.Hearts:
        return <JackOfHearts />;
      case Suit.Spades:
        return <JackOfSpades />;
    }
  }
}

export class Queen extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.Queen;
  }

  getNumber(): number {
    return 12;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <QueenOfClubs />;
      case Suit.Diamonds:
        return <QueenOfDiamonds />;
      case Suit.Hearts:
        return <QueenOfHearts />;
      case Suit.Spades:
        return <QueenOfSpades />;
    }
  }
}

export class King extends Card {
  constructor(suit: Suit) {
    super(suit);
    this.card = CardNumber.King;
  }

  getNumber(): number {
    return 13;
  }

  render(): JSX.Element {
    switch (this.suit) {
      case Suit.Clubs:
        return <KingOfClubs />;
      case Suit.Diamonds:
        return <KingOfDiamonds />;
      case Suit.Hearts:
        return <KingOfHearts />;
      case Suit.Spades:
        return <KingOfSpades />;
    }
  }
}

export function newCard(card: Card): Card {
  switch (card.card) {
    case CardNumber.Ace:
      let ace = card as Ace;
      return new Ace(ace.suit, ace.isOne);
    case CardNumber.Two:
      return new Two(card.suit);
    case CardNumber.Three:
      return new Three(card.suit);
    case CardNumber.Four:
      return new Four(card.suit);
    case CardNumber.Five:
      return new Five(card.suit);
    case CardNumber.Six:
      return new Six(card.suit);
    case CardNumber.Seven:
      return new Seven(card.suit);
    case CardNumber.Eight:
      return new Eight(card.suit);
    case CardNumber.Nine:
      return new Nine(card.suit);
    case CardNumber.Ten:
      return new Ten(card.suit);
    case CardNumber.Jack:
      return new Jack(card.suit);
    case CardNumber.Queen:
      return new Queen(card.suit);
    case CardNumber.King:
      return new King(card.suit);
    default:
      return new Ace(card.suit);
  }
}
