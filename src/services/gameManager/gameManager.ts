import {
  Ace,
  Card,
  CardEvent,
  CardNumber,
  CardType,
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
import { minBy, every, uniq, uniqBy, takeRight, some } from "lodash";
import {
  canPlayCard,
  createShuffledDeck,
  IsFourSameCards,
  IsNominationCard,
  SetAceOneStatuses,
} from "./gameFunctions";

export interface HistoryEntry {
  playerName?: string;
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

  players: Map<string, Player>;
  currentPlayerIndex: number;
  gameStarted: boolean = false;
  choosingBestCards: boolean = false;
  startingPlayers: string[] = [];
  firstMove = true;
  winners: OtherPlayer[] = [];
  history: HistoryEntry[] = [];
  lastPlayerId: string | null = null;
  lastCardsPlayed: Card[] = [];
  bottomDiscardPile: Card[] = [];
  public get discardPile(): Card[] {
    return this.bottomDiscardPile.concat(this.lastCardsPlayed);
  }

  constructor() {
    this.deck = [];

    this.players = new Map();
    this.currentPlayerIndex = -1;
  }

  startGame() {
    if (this.players.size < 2) {
      return;
    }

    this.deck = createShuffledDeck();
    this.clearDiscardPile();
    this.winners = [];

    for (let [id, player] of Array.from(this.players)) {
      player._hand = [];
      player.bestCards = [];
      player._blindCards = [];
      player.inGame = true;
      player.nominated = false;
      player.nominating = false;
    }
    this.dealCards();
    this.gameStarted = true;
    this.choosingBestCards = true;
    this.addHistory("Game Started. Good luck!");
  }

  clearDiscardPile() {
    this.lastCardsPlayed = [];
    this.bottomDiscardPile = [];
  }

  setStartingPlayers() {
    this.choosingBestCards = false;

    let allCards = this.playerArray()
      .map((p) => p.hand)
      .flat()
      .filter((c) => c.getNumber() !== 2 && c.getNumber() !== 1);
    let lowestCard = minBy(allCards, (c) => c.getNumber());
    let playersWithLowestCard = this.playerArray().filter((p) =>
      p.hand.some((c) => newCard(c).getNumber() === lowestCard?.getNumber())
    );

    this.startingPlayers = playersWithLowestCard.map((p) => p.playerId);
    this.addHistory(
      `Players with the lowest card: ${this.startingPlayers
        .map((p) => this.players.get(p).name)
        .join(", ")}`
    );
  }

  playerArray() {
    return Array.from(this.players.values()).filter(
      (p) => (this.gameStarted && p.inGame) || !this.gameStarted
    );
  }

  dealCards() {
    for (let i = 0; i < 6; i++) {
      for (let player of this.playerArray()) {
        let card = this.deck.pop();
        player._hand = [...player._hand, card!];
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

  canPlay(
    player: Player,
    cards: Card[],
    onFailCallback?: (errorMessage: string) => void
  ): boolean {
    if (this.IsSameCardAddedToPreviousPlay(player, cards)) {
      return true;
    }

    if (!this.isPlayersTurn(player.playerId)) {
      onFailCallback("It is not your turn.");
      return false;
    }

    return canPlayCard(player, cards, this.discardPile, (message) => {
      onFailCallback(message);
    });
  }

  private IsSameCardAddedToPreviousPlay(player: Player, cards: Card[]) {
    if (this.discardPile.length === 0) {
      return false;
    }

    return (
      this.lastPlayerId === player.playerId &&
      every(
        cards,
        (c) =>
          newCard(c).getNumber() ===
          this.discardPile[this.discardPile.length - 1].getNumber()
      )
    );
  }

  playCards(
    player: Player,
    cardsInput: CardType[],
    onFailCallback?: (error: string) => void
  ): void {
    let cards = cardsInput.map(newCard);

    if (!this.canPlay(player, cards, onFailCallback)) {
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
      onFailCallback(
        "No cards selected or cards not in your hand. Try refreshing."
      );
      return;
    }

    this.currentPlayerIndex = this.playerArray().findIndex(
      (p) => p.playerId === player.playerId
    );

    cardsToPlay = SetAceOneStatuses(cardsToPlay, this.discardPile);
    let cardEvent = this.getCardEvent(cardsToPlay);

    console.log("Card Event: ", cardEvent);

    let multipleCards = cardsToPlay.length > 1;
    this.addHistory(
      `plays ${
        multipleCards ? cardsToPlay.length : "a"
      } ${cardsToPlay[0].getName()}${multipleCards ? "s" : ""}.`,
      player.name,
      cardsToPlay,
      true
    );

    this.AddToDiscardPile(cardsToPlay, player);

    let postPlayAction = this.getPostPlayAction(player);
    this.handlePostPlayAction(player, postPlayAction);

    player.nominated = false;

    this.currentPlayerIndex = this.getPlayerIndexToPlay(cardEvent);
    this.handleCardEvent(player, cardEvent);
  }

  private AddToDiscardPile(cardsToPlay: Card[], player: Player) {
    this.bottomDiscardPile = this.bottomDiscardPile.concat(
      ...this.lastCardsPlayed.map((c) => newCard(c))
    );
    this.lastCardsPlayed = [];
    this.lastPlayerId = player.playerId;

    for (let card of cardsToPlay) {
      this.lastCardsPlayed.push(newCard(card!));
    }
  }

  private DrawCards(player: Player) {
    while (this.deck.length > 0 && player.hand.length < 3) {
      this.drawCard(player);
    }
  }

  getCardEvent(cardsToPlay: Card[]): CardEvent {
    if (cardsToPlay.length === 0) {
      throw new Error("No cards passed to getCardEvent.");
    }
    let card = cardsToPlay[0];
    if (
      IsFourSameCards(cardsToPlay, this.discardPile) ||
      card.card === CardNumber.Ten
    ) {
      return CardEvent.DiscardPile;
    }

    if (IsNominationCard(card, this.discardPile)) {
      return CardEvent.Nominate;
    }

    if (card.card === CardNumber.Seven) {
      return CardEvent.Back;
    }

    return CardEvent.Next;
  }

  hasPlayerWon(player: Player): PlayerWonModel | null {
    if (!player.inGame) {
      return null;
    }

    if (
      player.hand.length === 0 &&
      player.blindCards === 0 &&
      player.bestCards.length === 0
    ) {
      player.inGame = false;
      this.winners.push(new OtherPlayer(player, "Winner"));

      this.addHistory(
        `${player.name} has finished! Position: ${this.winners.length}`
      );
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
        player._hand = [...player.bestCards];
        player.bestCards = [];
        this.addHistory("has picked up their best cards.", player.name);
        break;
      case PostPlayAction.PickUpBlindCard:
        player._hand = [player._blindCards.pop()!];
        this.addHistory("has picked up a blind card.", player.name);
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

  handleNomination(player: Player, nominatedPlayerId: string) {
    let nominatedPlayer = this.players.get(nominatedPlayerId);

    if (!nominatedPlayer) {
      return;
    }
    nominatedPlayer.nominated = true;
    player.nominating = false;
    this.DrawCards(player);
    this.currentPlayerIndex = this.playerArray().findIndex(
      (p) => p.playerId === nominatedPlayerId
    );
  }

  private handleCardEvent(player: Player, card: CardEvent) {
    switch (card) {
      case CardEvent.Nominate:
        player.nominating = true;
        break;
      case CardEvent.DiscardPile:
        this.clearDiscardPile();
        this.DrawCards(player);
        break;
      default:
        this.DrawCards(player);
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

  selectBestCards(playerId: string, cards: CardType[]) {
    let player = this.players.get(playerId);
    if (!player) {
      return;
    }

    if (player.bestCards.length > 0) {
      return;
    }

    let cardsToSelect = cards
      .map(newCard)
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
      return;
    }

    player._hand = [...player._hand, this.deck.pop()!];
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

  getPlayerIndexToPlay(cardEvent: CardEvent): number {
    switch (cardEvent) {
      case CardEvent.Next:
        return this.getNextPlayer();
      case CardEvent.Back:
        return this.getPreviousPlayer();
      case CardEvent.DiscardPile:
        return this.currentPlayerIndex;
      case CardEvent.Nominate:
        return this.currentPlayerIndex;
    }
  }

  pickUpPile(player: Player) {
    player._hand = player._hand.concat(
      this.discardPile.map((c) =>
        c.card === CardNumber.One ? { card: CardNumber.Ace, suit: c.suit } : c
      )
    );
    this.clearDiscardPile();
    player.nominated = false;
    this.currentPlayerIndex = this.getNextPlayer();
  }

  getGameState(): GameState {
    return {
      currentPlayer: this.getCurrentPlayer(),
      cardSelectingState: this.choosingBestCards,
      gameStarted: this.gameStarted,
      history: this.history,
      pickupDeckNumber: this.deck.length,
      players: this.playerArray().map(
        (p) => new OtherPlayer(p, this.getPlayerStatus(p.playerId))
      ),
      startingPlayers: this.startingPlayers,
      winners: this.winners,
      discardPile: this.discardPile,
      bottomDiscardPile: this.bottomDiscardPile,
      lastCardsPlayed: this.lastCardsPlayed,
    };
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
      hand: player._hand,
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
    playerName?: string,
    cardsAttempted?: Card[],
    successful?: boolean
  ) {
    this.history.push({ message, playerName, cardsAttempted, successful });
  }
}
