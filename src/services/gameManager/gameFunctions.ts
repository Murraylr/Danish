import { takeRight, times, uniqBy } from "lodash";
import {
  Ace,
  Card,
  CardNumber,
  Eight,
  Five,
  Four,
  Jack,
  King,
  Nine,
  Queen,
  Seven,
  Six,
  Suit,
  Ten,
  Three,
  Two,
} from "../../models/card";
import { Player } from "../../models/player";

export function IsFourSameCards(cardsToPlay: Card[], discardPile: Card[]) {
  let deckAfterPlay = [...discardPile, ...cardsToPlay];

  return (
    deckAfterPlay.length >= 4 &&
    uniqBy(takeRight(deckAfterPlay, 4), (c) => c.getNumber()).length === 1
  );
}

export function IsNominationCard(card: Card, discardPile: Card[]) {
  let topDiscard = getTopDiscard(discardPile);

  let isAce = card.card === CardNumber.Ace;
  let isOnPowerCard = topDiscard?.isPowerCard;
  let isEightOnAce =
    card.card === CardNumber.Eight &&
    topDiscard?.card === CardNumber.Ace;

  return (isAce && !isOnPowerCard) || isEightOnAce;
}

export function getTopDiscard(discardPile: Card[]) {
  if (discardPile.length === 0) {
    return null;
  }
  let topIndex = discardPile.length - 1;

  while (topIndex >= 0 && discardPile[topIndex].getNumber() === 8) {
    topIndex--;
  }

  if (topIndex < 0 && discardPile.length > 0) {
    return discardPile[discardPile.length - 1];
  }

  return discardPile[topIndex];
}

export function createShuffledDeck() {
  let deck: Card[] = [];

  deck.push(new Ace(Suit.Clubs));
  deck.push(new Ace(Suit.Hearts));
  deck.push(new Ace(Suit.Diamonds));
  deck.push(new Ace(Suit.Spades));
  deck.push(new Two(Suit.Hearts));
  deck.push(new Two(Suit.Clubs));
  deck.push(new Two(Suit.Diamonds));
  deck.push(new Two(Suit.Spades));
  deck.push(new Three(Suit.Hearts));
  deck.push(new Three(Suit.Clubs));
  deck.push(new Three(Suit.Diamonds));
  deck.push(new Three(Suit.Spades));
  deck.push(new Four(Suit.Hearts));
  deck.push(new Four(Suit.Clubs));
  deck.push(new Four(Suit.Diamonds));
  deck.push(new Four(Suit.Spades));
  deck.push(new Five(Suit.Hearts));
  deck.push(new Five(Suit.Clubs));
  deck.push(new Five(Suit.Diamonds));
  deck.push(new Five(Suit.Spades));
  deck.push(new Six(Suit.Hearts));
  deck.push(new Six(Suit.Clubs));
  deck.push(new Six(Suit.Diamonds));
  deck.push(new Six(Suit.Spades));
  deck.push(new Seven(Suit.Hearts));
  deck.push(new Seven(Suit.Clubs));
  deck.push(new Seven(Suit.Diamonds));
  deck.push(new Seven(Suit.Spades));
  deck.push(new Eight(Suit.Hearts));
  deck.push(new Eight(Suit.Clubs));
  deck.push(new Eight(Suit.Diamonds));
  deck.push(new Eight(Suit.Spades));
  deck.push(new Nine(Suit.Hearts));
  deck.push(new Nine(Suit.Clubs));
  deck.push(new Nine(Suit.Diamonds));
  deck.push(new Nine(Suit.Spades));
  deck.push(new Ten(Suit.Hearts));
  deck.push(new Ten(Suit.Clubs));
  deck.push(new Ten(Suit.Diamonds));
  deck.push(new Ten(Suit.Spades));
  deck.push(new Jack(Suit.Hearts));
  deck.push(new Jack(Suit.Clubs));
  deck.push(new Jack(Suit.Diamonds));
  deck.push(new Jack(Suit.Spades));
  deck.push(new Queen(Suit.Hearts));
  deck.push(new Queen(Suit.Clubs));
  deck.push(new Queen(Suit.Diamonds));
  deck.push(new Queen(Suit.Spades));
  deck.push(new King(Suit.Hearts));
  deck.push(new King(Suit.Clubs));
  deck.push(new King(Suit.Diamonds));
  deck.push(new King(Suit.Spades));

  times(10, () => shuffleDeck(deck));

  return deck;
}

function shuffleDeck(deck: Card[]) {
  return deck.sort(() => Math.random() - 0.5);
}

export function canPlayCard(
  player: Player,
  cards: Card[],
  discardPile: Card[],
  onFailCallback: (message: string) => void
) {
  if (player.nominating) {
    console.log("Cannot Play: Player needs to nominate.");
    onFailCallback("You need to nominate a player to play a magic card.");
    return false;
  }

  if (!cards || cards.length === 0) {
    console.log("Cannot Play: No cards selected.");
    onFailCallback("You have not selected any cards.");
    return false;
  }

  if (uniqBy(cards, (card) => card.getNumber())?.length > 1) {
    console.log("Cannot Play: More than one number selected.");
    onFailCallback("You cannot play multiple different numbers in one move.");
    return false;
  }

  let card = cards[0];

  return card.canPlay(discardPile, onFailCallback);
}

export function SetAceOneStatuses(cardsToPlay: Card[], discardPile: Card[]) {
  let card = cardsToPlay[0];
  let isOnes =
    card.card === CardNumber.Ace && !IsNominationCard(card, discardPile);

  if (isOnes) {
    return cardsToPlay.map((card) => new Ace(card.suit, true));
  }

  return cardsToPlay;
}


