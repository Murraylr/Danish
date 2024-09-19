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
import { PlayerWonModel } from "../../models/playerWonModel";
import { omitProperty, proxiedPropertiesOf } from "../typeUtils";
import { minBy, every, uniq, uniqBy } from "lodash";

export interface HistoryEntry {
  player?: Player;
  cardsAttempted?: Card[];
  successful?: boolean;
  message: string;
}

enum PostPlayAction {
  None,
  PickUpBestCards,
  PickUpBlindCard,
  Win,
}

export class GameManager {
  deck: Card[];
  discardPile: Card[];
  players: Map<string, Player>;
  currentPlayerIndex: number;
  gameStarted: boolean = false;
  choosingBestCards: boolean = false;
  startingPlayers: string[] = [];
  firstMove = true;
  winners: Player[] = [];
  history: HistoryEntry[] = [];

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
      console.log("Creating second deck.");
      this.createDeck();
    }

    for (let i = 0; i < 10; i++) {
      this.shuffleDeck();
    }

    for (let player of this.playerArray()) {
      player.hand = [];
      player.inGame = true;
    }
    this.dealCards();
    this.gameStarted = true;
    this.choosingBestCards = true;
    this.addHistory("Game Started. Good luck!");
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

    this.addHistory(
      `Players with the lowest card: ${this.playerArray()
        .map((p) => p.name)
        .join(", ")}`
    );
    this.startingPlayers = playersWithLowestCard.map((p) => p.playerId);
  }

  playerArray() {
    return Array.from(this.players.values()).filter(
      (p) => (this.gameStarted && p.inGame) || !this.gameStarted
    );
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
    this.addHistory(`${player.name} has joined the game.`);
  }

  markPlayerReady(playerId: string, isReady: boolean) {
    let player = this.players.get(playerId);

    if (!player) {
      return;
    }

    player.ready = isReady;
    this.addHistory(`${player.name} is ${isReady ? "ready" : "not ready"}.`);
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
    this.addHistory(`Player has left the game.`);
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
    this.addHistory(`${player.name} has disconnected.`);
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
      console.log("Player with id: ", playerId, " not found.");
      return false;
    }

    if (this.getCurrentPlayer().some((p) => p.playerId === playerId)) {
      return true;
    }

    console.log(
      "Player with id: ",
      playerId,
      " not in current player list. Current player list",
      this.getCurrentPlayer()
    );
    return false;
  }

  canPlay(player: Player, cards: Card[]) {
    if (!this.isPlayersTurn(player.playerId)) {
      console.log("Cannot Play: Not players turn.");
      return false;
    }

    if (player.nominating) {
      console.log("Cannot Play: Player needs to nominate.");
      return false;
    }

    if (!cards || cards.length === 0) {
      console.log("Cannot Play: No cards selected.");
      return false;
    }

    if (uniqBy(cards, (card) => card.getNumber())?.length > 1) {
      console.log("Cannot Play: More than one number selected.");
      return false;
    }

    let card = cards[0];

    return card.canPlay(this.discardPile, (message) => {
      this.addHistory(message, player, cards, false);
    });
  }

  playCards(
    player: Player,
    cardsInput: Card[],
    onFailCallback?: (error: string) => void
  ): void {
    let cards = cardsInput.map(newCard);

    if (!this.canPlay(player, cards)) {
      if (onFailCallback) onFailCallback("Cannot play those cards.");
      return;
    }

    if (this.startingPlayers.length) {
      this.startingPlayers = [];
      this.currentPlayerIndex = this.playerArray().findIndex(
        (p) => p.playerId === player.playerId
      );
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
      if (onFailCallback)
        onFailCallback(
          "No cards selected or cards not in your hand. Try refreshing."
        );
      return;
    }

    this.currentPlayerIndex = this.playerArray().findIndex(
      (p) => p.playerId === player.playerId
    );
    this.changeAcesToOne(cardsToPlay);
    let cardEvent = cardsToPlay[0]!.getCardEvent(this.discardPile);
    console.log("Card Event: ", cardEvent);
    let previousPile = [...this.discardPile];

    this.addHistory(
      `plays ${cardsToPlay.length} ${cardsToPlay[0].getName()}s.`,
      player,
      cardsToPlay,
      true
    );
    for (let card of cardsToPlay) {
      this.discardPile.push(newCard(card!));
    }
    while (this.deck.length > 0 && player.hand.length < 3) {
      this.drawCard(player);
    }

    let postPlayAction = this.getPostPlayAction(player);
    this.handlePostPlayAction(player, postPlayAction);

    player.nominated = false;

    this.currentPlayerIndex = this.getPlayerIndexToPlay(
      cardsToPlay[0]!,
      previousPile
    );
    this.handleCardEvent(player, cardEvent);
  }

  hasPlayerWon(player: Player): PlayerWonModel | null {
    if (!player.inGame) {
      return null;
    }

    if (player.hand.length === 0 && player.blindCards === 0 && player.bestCards.length === 0) {
      player.inGame = false;
      this.winners.push(player);

      this.addHistory(`${player.name} has finished! Position: ${this.winners.length}`);
      if (this.winners.length === this.players.size - 1) {
        let loser = this.playerArray().find((p) => p.inGame);
        this.addHistory(`${loser.name} has lost!`);
      }
      return {
        player: player,
        position: this.winners.length,
      };
    }

    return null;
  }

  private handlePostPlayAction(player: Player, postPlayAction: PostPlayAction) {
    switch (postPlayAction) {
      case PostPlayAction.PickUpBestCards:
        player.hand = player.bestCards.map(newCard);
        player.bestCards = [];
        this.addHistory("has picked up their best cards.", player);
        break;
      case PostPlayAction.PickUpBlindCard:
        player.hand.push(player._blindCards.pop()!);
        this.addHistory("has picked up a blind card.", player);
        break;
    }
  }

  private getPostPlayAction(player: Player) {
    if (this.deck.length > 0 || player.hand.length > 0) {
      return PostPlayAction.None;
    }

    if (player.bestCards.length > 0) {
      return PostPlayAction.PickUpBestCards;
    }

    if (player.blindCards > 0) {
      return PostPlayAction.PickUpBlindCard;
    }

    return PostPlayAction.Win;
  }

  private changeAcesToOne(cardsToPlay: Card[]) {
    if (this.discardPile.length === 0) {
      return;
    }

    if (
      this.getTopDiscard()?.isPowerCard &&
      cardsToPlay[0].card === CardNumber.Ace
    ) {
      for (let card of cardsToPlay) {
        console.log("Aces are ones.");
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
    console.log("Game state: ", this);
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

  addHistory(
    message: string,
    player?: Player,
    cardsAttempted?: Card[],
    successful?: boolean
  ) {
    this.history.push({ message, player, cardsAttempted, successful });
  }
}

export class GameManagerTester extends GameManager {
  startGame(
    numPlayers: number = 2,
    deckAmount: number = 10,
    blindAmount: number = 3,
    bestAmount: number = 3,
    handAmount: number = 3,
    discardPile: Card[] = []
  ) {
    for (let i = 0; i < numPlayers; i++) {
      this.addPlayer(new Player(i.toString(), `Player ${i}`));
    }

    this.createDeck();
    this.shuffleDeck();

    let deck = [...this.deck];
    this.deck = [];

    for (let i = 0; i < deckAmount; i++) {
      this.deck.push(deck.pop()!);
    }

    for (let i = 0; i < blindAmount; i++) {
      for (let player of this.playerArray()) {
        player.addBlindCard(deck.pop()!);
      }
    }

    for (let i = 0; i < bestAmount; i++) {
      for (let player of this.playerArray()) {
        player.bestCards.push(deck.pop()!);
      }
    }

    for (let i = 0; i < handAmount; i++) {
      for (let player of this.playerArray()) {
        player.hand.push(deck.pop()!);
      }
    }

    this.discardPile = discardPile;
    this.choosingBestCards = false;
    this.currentPlayerIndex = 0;
    this.gameStarted = true;
  }
}
