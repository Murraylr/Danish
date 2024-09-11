import {
  Ace,
  Card,
  CardEvent,
  CardNumber,
  Eight,
  Five,
  Four,
  Jack,
  King,
  newCard,
  Nine,
  Queen,
  Seven,
  Six,
  Suit,
  Ten,
  Three,
  Two,
} from "../../models/card";
import { GameState } from "../../models/gameState";
import { OtherPlayer } from "../../models/otherPlayer";
import { Player, VisiblePlayer } from "../../models/player";
import { PlayerState } from "../../models/playerUpdate";
import { omitProperty, proxiedPropertiesOf } from "../typeUtils";
import { minBy, every, uniq, uniqBy } from "lodash";

export class GameManager {
  deck: Card[];
  discardPile: Card[];
  players: Map<string, Player>;
  currentPlayerIndex: number;
  gameStarted: boolean = false;
  choosingBestCards: boolean = false;
  startingPlayers: string[] = [];
  firstMove = true;
  winners: string[] = [];

  constructor() {
    this.deck = [];
    this.discardPile = [];
    this.players = new Map();
    this.currentPlayerIndex = -1;
  }

  startGame() {
    if (this.players.size < 2) {
      return;
    }

    this.createDeck();

    if (this.players.size > 3) {
      this.createDeck();
    }

    for (let i = 0; i < 10; i++) {
      this.shuffleDeck();
    }

    for (let player of this.playerArray()) {
      player.hand = [];
    }
    this.dealCards();
    this.gameStarted = true;
    this.choosingBestCards = true;
  }

  setStartingPlayers() {
    this.choosingBestCards = false;

    let allCards = this.playerArray()
      .map((p) => p.hand)
      .flat()
      .filter((c) => c.getNumber() !== 2 && c.getNumber() !== 1);
    let lowestCard = minBy(allCards, (c) => c.getNumber());
    let playersWithLowestCard = this.playerArray().filter((p) =>
      p.hand.some((c) => c.getNumber() === lowestCard?.getNumber())
    );

    this.startingPlayers = playersWithLowestCard.map((p) => p.playerId);
  }

  playerArray() {
    return Array.from(this.players.values());
  }

  createDeck() {
    this.deck.push(new Ace(Suit.Hearts));
    this.deck.push(new Ace(Suit.Clubs));
    this.deck.push(new Ace(Suit.Diamonds));
    this.deck.push(new Ace(Suit.Spades));
    this.deck.push(new Two(Suit.Hearts));
    this.deck.push(new Two(Suit.Clubs));
    this.deck.push(new Two(Suit.Diamonds));
    this.deck.push(new Two(Suit.Spades));
    this.deck.push(new Three(Suit.Hearts));
    this.deck.push(new Three(Suit.Clubs));
    this.deck.push(new Three(Suit.Diamonds));
    this.deck.push(new Three(Suit.Spades));
    this.deck.push(new Four(Suit.Hearts));
    this.deck.push(new Four(Suit.Clubs));
    this.deck.push(new Four(Suit.Diamonds));
    this.deck.push(new Four(Suit.Spades));
    this.deck.push(new Five(Suit.Hearts));
    this.deck.push(new Five(Suit.Clubs));
    this.deck.push(new Five(Suit.Diamonds));
    this.deck.push(new Five(Suit.Spades));
    this.deck.push(new Six(Suit.Hearts));
    this.deck.push(new Six(Suit.Clubs));
    this.deck.push(new Six(Suit.Diamonds));
    this.deck.push(new Six(Suit.Spades));
    this.deck.push(new Seven(Suit.Hearts));
    this.deck.push(new Seven(Suit.Clubs));
    this.deck.push(new Seven(Suit.Diamonds));
    this.deck.push(new Seven(Suit.Spades));
    this.deck.push(new Eight(Suit.Hearts));
    this.deck.push(new Eight(Suit.Clubs));
    this.deck.push(new Eight(Suit.Diamonds));
    this.deck.push(new Eight(Suit.Spades));
    this.deck.push(new Nine(Suit.Hearts));
    this.deck.push(new Nine(Suit.Clubs));
    this.deck.push(new Nine(Suit.Diamonds));
    this.deck.push(new Nine(Suit.Spades));
    this.deck.push(new Ten(Suit.Hearts));
    this.deck.push(new Ten(Suit.Clubs));
    this.deck.push(new Ten(Suit.Diamonds));
    this.deck.push(new Ten(Suit.Spades));
    this.deck.push(new Jack(Suit.Hearts));
    this.deck.push(new Jack(Suit.Clubs));
    this.deck.push(new Jack(Suit.Diamonds));
    this.deck.push(new Jack(Suit.Spades));
    this.deck.push(new Queen(Suit.Hearts));
    this.deck.push(new Queen(Suit.Clubs));
    this.deck.push(new Queen(Suit.Diamonds));
    this.deck.push(new Queen(Suit.Spades));
    this.deck.push(new King(Suit.Hearts));
    this.deck.push(new King(Suit.Clubs));
    this.deck.push(new King(Suit.Diamonds));
    this.deck.push(new King(Suit.Spades));
  }

  shuffleDeck() {
    this.deck.sort(() => Math.random() - 0.5);
  }

  dealCards() {
    for (let i = 0; i < 6; i++) {
      for (let player of this.playerArray()) {
        let card = this.deck.pop();
        player.hand.push(card!);
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let player of this.playerArray()) {
        let card = this.deck.pop();
        player.addBlindCard(card!);
      }
    }
  }

  addPlayer(player: Player) {
    if (this.players.size >= 6) {
      return;
    }

    this.players.set(player.playerId, player);
  }

  markPlayerReady(playerId: string, isReady: boolean) {
    let player = this.players.get(playerId);

    if (!player) {
      return;
    }

    player.ready = isReady;
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
  }

  getPlayerStatus(playerId: string) {
    let player = this.players.get(playerId);
    if (!player) {
      return "Left Room";
    }

    if (!player.connected) {
      return "Disconnected";
    }

    if (this.gameStarted) {
      return "Online";
    }

    return player.ready ? "Ready" : "Not Ready";
  }

  markDisconnected(playerId: string) {
    let player = this.players.get(playerId);

    if (!player) {
      return;
    }

    player.connected = false;
  }

  getCurrentPlayer(): OtherPlayer[] {
    if (this.startingPlayers.length) {
      return this.startingPlayers
        .map((p) => this.players.get(p))
        .filter((p) => p !== null)
        .map((p) => new OtherPlayer(p!, this.getPlayerStatus(p!.playerId)));
    }

    let player =
      this.currentPlayerIndex === -1
        ? null
        : this.playerArray()[this.currentPlayerIndex];

    return !player
      ? []
      : [new OtherPlayer(player, this.getPlayerStatus(player.playerId))];
  }

  isPlayersTurn(playerId: string) {
    let player = this.players.get(playerId);
    if (!player) {
      return false;
    }

    if (this.getCurrentPlayer().some((p) => p.playerId === playerId)) {
      return true;
    }

    return false;
  }

  canPlay(player: Player, cards: Card[]) {
    if (!this.isPlayersTurn(player.playerId)) {
      return false;
    }

    if (player.nominating) {
      return false;
    }

    if (!cards || cards.length === 0) {
      return false;
    }

    if (uniqBy(cards, (card) => card.getNumber())?.length > 1) {
      return false;
    }

    let card = cards[0];

    if (!card.canPlay(this.discardPile)) {
      return false;
    }

    return true;
  }

  playCards(player: Player, cardsInput: Card[]) {
    let cards = cardsInput.map(newCard);

    if (!this.canPlay(player, cards)) {
      return;
    }

    if (this.startingPlayers.length) {
      this.startingPlayers = [];
      this.currentPlayerIndex = this.playerArray().findIndex(p => p.playerId === player.playerId); 
    }

    let cardsToPlay = cards
      .map((c) => player.removeCardFromHand(c))
      .filter((c) => !!c)
      .map((c) => c!);
    if (
      !cardsToPlay ||
      cardsToPlay.length === 0 ||
      cardsToPlay.length !== cards.length
    ) {
      return;
    }

    this.currentPlayerIndex = this.playerArray().findIndex(p => p.playerId === player.playerId);
    this.changeAcesToOne(cardsToPlay);
    let cardEvent = cardsToPlay[0]!.getCardEvent(this.discardPile);
    let previousPile = [...this.discardPile];


    for (let card of cardsToPlay) {
      this.discardPile.push(newCard(card!));
    }
    while (this.deck.length > 0 && player.hand.length < 3) {
      this.drawCard(player);
    }

    if (this.deck.length === 0 && player.hand.length === 0) {
      player.hand = player.bestCards.map(newCard);
      player.bestCards = [];
    }

    if (player.hand.length === 0 && this.deck.length === 0 &&  player.bestCards.length === 0) {
      let blindCard = player._blindCards.pop();
      player.hand.push(blindCard!);
    }


    player.nominated = false;

    this.currentPlayerIndex = this.getPlayerIndexToPlay(cardsToPlay[0]!, previousPile);
    this.handleCardEvent(player, cardEvent);

    if (player.blindCards === 0 && player.hand.length === 0) {
      this.winners.push(player.playerId);
    }

    return;
  }

  private changeAcesToOne(cardsToPlay: Card[]) {
    if(this.discardPile.length === 0) {
      return;
    }

    if (this.discardPile[this.discardPile.length - 1].isPowerCard && cardsToPlay[0].card === CardNumber.Ace) {
      for (let card of cardsToPlay) {
        let ace = card as Ace;
        ace.isOne = true;
      }
    }
  }

  handleNomination(player: Player, nominatedPlayerId: string) {
    let nominatedPlayer = this.players.get(nominatedPlayerId);

    if (!nominatedPlayer) {
      return;
    }
    nominatedPlayer.nominated = true;
    player.nominating = false;
    this.currentPlayerIndex = this.playerArray().findIndex(
      (p) => p.playerId === nominatedPlayerId
    );
  }

  private handleCardEvent(player: Player, card: CardEvent) {
    switch (card) {
      case CardEvent.Nominate:
        player.nominating = true;
        break;
      case CardEvent.Ten:
        this.discardPile = [];
        break;
      default:
        break;
    }
  }

  nominatingPlayer(): Player | null {
    let players = this.playerArray();
    let player = players[this.currentPlayerIndex];
    if (player.nominating) {
      return player;
    }

    return null;
  }

  selectBestCards(playerId: string, cards: Card[]) {
    let player = this.players.get(playerId);
    if (!player) {
      return;
    }

    if (player.bestCards.length > 0) {
      return;
    }

    let cardsToSelect = cards
      .map((c) => player!.removeCardFromHand(c))
      .filter((c) => c !== null);
    if (!cardsToSelect || cardsToSelect.length === 0) {
      return;
    }

    for (let card of cardsToSelect) {
      player!.bestCards.push(card!);
    }
  }

  drawCard(player: Player) {
    if (this.deck.length === 0) {
    }

    player.hand.push(this.deck.pop()!);
  }

  getTopDiscard() {
    if (this.discardPile.length === 0) {
      return null;
    }
    let topIndex = this.discardPile.length - 1;

    while (topIndex >= 0 && this.discardPile[topIndex].getNumber() === 8) {
      topIndex--;
    }

    if (topIndex < 0 && this.discardPile.length > 0) {
      return this.discardPile[this.discardPile.length - 1];
    }

    return this.discardPile[topIndex];
  }

  getNextPlayer() {
    return (this.currentPlayerIndex + 1) % this.players.size;
  }

  getPreviousPlayer() {
    if (this.currentPlayerIndex === 0) {
      return this.players.size - 1;
    }

    return (this.currentPlayerIndex - 1) % this.players.size;
  }

  getPlayerIndexToPlay(cardPlayed: Card, discardPile: Card[]): number {
    let nextPlayer = cardPlayed.getCardEvent(discardPile);

    switch (nextPlayer) {
      case CardEvent.Next:
        return this.getNextPlayer();
      case CardEvent.Back:
        return this.getPreviousPlayer();
      case CardEvent.Ten:
        return this.currentPlayerIndex;
      case CardEvent.Nominate:
        return this.currentPlayerIndex;
    }
  }

  pickUpPile(player: Player) {
    player.hand = player.hand.concat(this.discardPile);
    this.discardPile = [];
    this.currentPlayerIndex = this.getNextPlayer();
  }

  getGameState(): GameState {
    return new GameState(this);
  }

  getPlayerState(player: Player): PlayerState {
    let blindCards = player.blindCards;
    let mePlayer = omitProperty(
      player,
      proxiedPropertiesOf<Player>()._blindCards
    );
    let me: VisiblePlayer = {
      ...mePlayer,
      blindCards,
    };

    return {
      hand: player.hand,
      name: player.name,
      isNominating: me.nominating,
      isNominated: me.nominated,
      otherPlayers: this.playerArray()
        .filter((p) => p !== player)
        .map((p) => new OtherPlayer(p, this.getPlayerStatus(p.playerId))),
      me,
    };
  }
}
