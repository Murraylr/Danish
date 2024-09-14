"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
var card_1 = require("../../models/card");
var gameState_1 = require("../../models/gameState");
var otherPlayer_1 = require("../../models/otherPlayer");
var typeUtils_1 = require("../typeUtils");
var lodash_1 = require("lodash");
var GameManager = /** @class */ (function () {
    function GameManager() {
        this.gameStarted = false;
        this.choosingBestCards = false;
        this.startingPlayers = [];
        this.firstMove = true;
        this.winners = [];
        this.deck = [];
        this.discardPile = [];
        this.players = new Map();
        this.currentPlayerIndex = -1;
    }
    GameManager.prototype.startGame = function () {
        if (this.players.size < 2) {
            return;
        }
        this.createDeck();
        if (this.players.size > 3) {
            this.createDeck();
        }
        for (var i = 0; i < 10; i++) {
            this.shuffleDeck();
        }
        for (var _i = 0, _a = this.playerArray(); _i < _a.length; _i++) {
            var player = _a[_i];
            player.hand = [];
        }
        this.dealCards();
        this.gameStarted = true;
        this.choosingBestCards = true;
    };
    GameManager.prototype.setStartingPlayers = function () {
        this.choosingBestCards = false;
        var allCards = this.playerArray()
            .map(function (p) { return p.hand; })
            .flat()
            .filter(function (c) { return c.getNumber() !== 2 && c.getNumber() !== 1; });
        var lowestCard = (0, lodash_1.minBy)(allCards, function (c) { return c.getNumber(); });
        var playersWithLowestCard = this.playerArray().filter(function (p) {
            return p.hand.some(function (c) { return c.getNumber() === (lowestCard === null || lowestCard === void 0 ? void 0 : lowestCard.getNumber()); });
        });
        this.startingPlayers = playersWithLowestCard.map(function (p) { return p.playerId; });
    };
    GameManager.prototype.playerArray = function () {
        return Array.from(this.players.values());
    };
    GameManager.prototype.createDeck = function () {
        this.deck.push(new card_1.Ace(card_1.Suit.Hearts));
        this.deck.push(new card_1.Ace(card_1.Suit.Clubs));
        this.deck.push(new card_1.Ace(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Ace(card_1.Suit.Spades));
        this.deck.push(new card_1.Two(card_1.Suit.Hearts));
        this.deck.push(new card_1.Two(card_1.Suit.Clubs));
        this.deck.push(new card_1.Two(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Two(card_1.Suit.Spades));
        this.deck.push(new card_1.Three(card_1.Suit.Hearts));
        this.deck.push(new card_1.Three(card_1.Suit.Clubs));
        this.deck.push(new card_1.Three(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Three(card_1.Suit.Spades));
        this.deck.push(new card_1.Four(card_1.Suit.Hearts));
        this.deck.push(new card_1.Four(card_1.Suit.Clubs));
        this.deck.push(new card_1.Four(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Four(card_1.Suit.Spades));
        this.deck.push(new card_1.Five(card_1.Suit.Hearts));
        this.deck.push(new card_1.Five(card_1.Suit.Clubs));
        this.deck.push(new card_1.Five(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Five(card_1.Suit.Spades));
        this.deck.push(new card_1.Six(card_1.Suit.Hearts));
        this.deck.push(new card_1.Six(card_1.Suit.Clubs));
        this.deck.push(new card_1.Six(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Six(card_1.Suit.Spades));
        this.deck.push(new card_1.Seven(card_1.Suit.Hearts));
        this.deck.push(new card_1.Seven(card_1.Suit.Clubs));
        this.deck.push(new card_1.Seven(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Seven(card_1.Suit.Spades));
        this.deck.push(new card_1.Eight(card_1.Suit.Hearts));
        this.deck.push(new card_1.Eight(card_1.Suit.Clubs));
        this.deck.push(new card_1.Eight(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Eight(card_1.Suit.Spades));
        this.deck.push(new card_1.Nine(card_1.Suit.Hearts));
        this.deck.push(new card_1.Nine(card_1.Suit.Clubs));
        this.deck.push(new card_1.Nine(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Nine(card_1.Suit.Spades));
        this.deck.push(new card_1.Ten(card_1.Suit.Hearts));
        this.deck.push(new card_1.Ten(card_1.Suit.Clubs));
        this.deck.push(new card_1.Ten(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Ten(card_1.Suit.Spades));
        this.deck.push(new card_1.Jack(card_1.Suit.Hearts));
        this.deck.push(new card_1.Jack(card_1.Suit.Clubs));
        this.deck.push(new card_1.Jack(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Jack(card_1.Suit.Spades));
        this.deck.push(new card_1.Queen(card_1.Suit.Hearts));
        this.deck.push(new card_1.Queen(card_1.Suit.Clubs));
        this.deck.push(new card_1.Queen(card_1.Suit.Diamonds));
        this.deck.push(new card_1.Queen(card_1.Suit.Spades));
        this.deck.push(new card_1.King(card_1.Suit.Hearts));
        this.deck.push(new card_1.King(card_1.Suit.Clubs));
        this.deck.push(new card_1.King(card_1.Suit.Diamonds));
        this.deck.push(new card_1.King(card_1.Suit.Spades));
    };
    GameManager.prototype.shuffleDeck = function () {
        this.deck.sort(function () { return Math.random() - 0.5; });
    };
    GameManager.prototype.dealCards = function () {
        for (var i = 0; i < 6; i++) {
            for (var _i = 0, _a = this.playerArray(); _i < _a.length; _i++) {
                var player = _a[_i];
                var card = this.deck.pop();
                player.hand.push(card);
            }
        }
        for (var i = 0; i < 3; i++) {
            for (var _b = 0, _c = this.playerArray(); _b < _c.length; _b++) {
                var player = _c[_b];
                var card = this.deck.pop();
                player.addBlindCard(card);
            }
        }
    };
    GameManager.prototype.addPlayer = function (player) {
        if (this.players.size >= 6) {
            return;
        }
        this.players.set(player.playerId, player);
    };
    GameManager.prototype.markPlayerReady = function (playerId, isReady) {
        var player = this.players.get(playerId);
        if (!player) {
            return;
        }
        player.ready = isReady;
    };
    GameManager.prototype.removePlayer = function (playerId) {
        this.players.delete(playerId);
    };
    GameManager.prototype.getPlayerStatus = function (playerId) {
        var player = this.players.get(playerId);
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
    };
    GameManager.prototype.markDisconnected = function (playerId) {
        var player = this.players.get(playerId);
        if (!player) {
            return;
        }
        player.connected = false;
    };
    GameManager.prototype.getCurrentPlayer = function () {
        var _this = this;
        if (this.startingPlayers.length) {
            return this.startingPlayers
                .map(function (p) { return _this.players.get(p); })
                .filter(function (p) { return p !== null; })
                .map(function (p) { return new otherPlayer_1.OtherPlayer(p, _this.getPlayerStatus(p.playerId)); });
        }
        var player = this.currentPlayerIndex === -1
            ? null
            : this.playerArray()[this.currentPlayerIndex];
        return !player
            ? []
            : [new otherPlayer_1.OtherPlayer(player, this.getPlayerStatus(player.playerId))];
    };
    GameManager.prototype.isPlayersTurn = function (playerId) {
        var player = this.players.get(playerId);
        if (!player) {
            return false;
        }
        if (this.getCurrentPlayer().some(function (p) { return p.playerId === playerId; })) {
            return true;
        }
        return false;
    };
    GameManager.prototype.canPlay = function (player, cards) {
        var _a;
        if (!this.isPlayersTurn(player.playerId)) {
            return false;
        }
        if (player.nominating) {
            return false;
        }
        if (!cards || cards.length === 0) {
            return false;
        }
        if (((_a = (0, lodash_1.uniqBy)(cards, function (card) { return card.getNumber(); })) === null || _a === void 0 ? void 0 : _a.length) > 1) {
            return false;
        }
        var card = cards[0];
        if (!card.canPlay(this.discardPile)) {
            return false;
        }
        return true;
    };
    GameManager.prototype.playCards = function (player, cardsInput) {
        var cards = cardsInput.map(card_1.newCard);
        if (!this.canPlay(player, cards)) {
            return;
        }
        if (this.startingPlayers.length) {
            this.startingPlayers = [];
            this.currentPlayerIndex = this.playerArray().findIndex(function (p) { return p.playerId === player.playerId; });
        }
        var cardsToPlay = cards
            .map(function (c) { return player.removeCardFromHand(c); })
            .filter(function (c) { return !!c; })
            .map(function (c) { return c; });
        if (!cardsToPlay ||
            cardsToPlay.length === 0 ||
            cardsToPlay.length !== cards.length) {
            return;
        }
        this.currentPlayerIndex = this.playerArray().findIndex(function (p) { return p.playerId === player.playerId; });
        this.changeAcesToOne(cardsToPlay);
        var cardEvent = cardsToPlay[0].getCardEvent(this.discardPile);
        var previousPile = __spreadArray([], this.discardPile, true);
        for (var _i = 0, cardsToPlay_1 = cardsToPlay; _i < cardsToPlay_1.length; _i++) {
            var card = cardsToPlay_1[_i];
            this.discardPile.push((0, card_1.newCard)(card));
        }
        while (this.deck.length > 0 && player.hand.length < 3) {
            this.drawCard(player);
        }
        if (this.deck.length === 0 && player.hand.length === 0) {
            player.hand = player.bestCards.map(card_1.newCard);
            player.bestCards = [];
        }
        if (player.hand.length === 0 && this.deck.length === 0 && player.bestCards.length === 0) {
            var blindCard = player._blindCards.pop();
            player.hand.push(blindCard);
        }
        player.nominated = false;
        this.currentPlayerIndex = this.getPlayerIndexToPlay(cardsToPlay[0], previousPile);
        this.handleCardEvent(player, cardEvent);
        if (player.blindCards === 0 && player.hand.length === 0) {
            this.winners.push(player.playerId);
        }
        return;
    };
    GameManager.prototype.changeAcesToOne = function (cardsToPlay) {
        if (this.discardPile.length === 0) {
            return;
        }
        if (this.discardPile[this.discardPile.length - 1].isPowerCard && cardsToPlay[0].card === card_1.CardNumber.Ace) {
            for (var _i = 0, cardsToPlay_2 = cardsToPlay; _i < cardsToPlay_2.length; _i++) {
                var card = cardsToPlay_2[_i];
                var ace = card;
                ace.isOne = true;
            }
        }
    };
    GameManager.prototype.handleNomination = function (player, nominatedPlayerId) {
        var nominatedPlayer = this.players.get(nominatedPlayerId);
        if (!nominatedPlayer) {
            return;
        }
        nominatedPlayer.nominated = true;
        player.nominating = false;
        this.currentPlayerIndex = this.playerArray().findIndex(function (p) { return p.playerId === nominatedPlayerId; });
    };
    GameManager.prototype.handleCardEvent = function (player, card) {
        switch (card) {
            case card_1.CardEvent.Nominate:
                player.nominating = true;
                break;
            case card_1.CardEvent.Ten:
                this.discardPile = [];
                break;
            default:
                break;
        }
    };
    GameManager.prototype.nominatingPlayer = function () {
        var players = this.playerArray();
        var player = players[this.currentPlayerIndex];
        if (player.nominating) {
            return player;
        }
        return null;
    };
    GameManager.prototype.selectBestCards = function (playerId, cards) {
        var player = this.players.get(playerId);
        if (!player) {
            return;
        }
        if (player.bestCards.length > 0) {
            return;
        }
        var cardsToSelect = cards
            .map(function (c) { return player.removeCardFromHand(c); })
            .filter(function (c) { return c !== null; });
        if (!cardsToSelect || cardsToSelect.length === 0) {
            return;
        }
        for (var _i = 0, cardsToSelect_1 = cardsToSelect; _i < cardsToSelect_1.length; _i++) {
            var card = cardsToSelect_1[_i];
            player.bestCards.push(card);
        }
    };
    GameManager.prototype.drawCard = function (player) {
        if (this.deck.length === 0) {
        }
        player.hand.push(this.deck.pop());
    };
    GameManager.prototype.getTopDiscard = function () {
        if (this.discardPile.length === 0) {
            return null;
        }
        var topIndex = this.discardPile.length - 1;
        while (topIndex >= 0 && this.discardPile[topIndex].getNumber() === 8) {
            topIndex--;
        }
        if (topIndex < 0 && this.discardPile.length > 0) {
            return this.discardPile[this.discardPile.length - 1];
        }
        return this.discardPile[topIndex];
    };
    GameManager.prototype.getNextPlayer = function () {
        return (this.currentPlayerIndex + 1) % this.players.size;
    };
    GameManager.prototype.getPreviousPlayer = function () {
        if (this.currentPlayerIndex === 0) {
            return this.players.size - 1;
        }
        return (this.currentPlayerIndex - 1) % this.players.size;
    };
    GameManager.prototype.getPlayerIndexToPlay = function (cardPlayed, discardPile) {
        var nextPlayer = cardPlayed.getCardEvent(discardPile);
        switch (nextPlayer) {
            case card_1.CardEvent.Next:
                return this.getNextPlayer();
            case card_1.CardEvent.Back:
                return this.getPreviousPlayer();
            case card_1.CardEvent.Ten:
                return this.currentPlayerIndex;
            case card_1.CardEvent.Nominate:
                return this.currentPlayerIndex;
        }
    };
    GameManager.prototype.pickUpPile = function (player) {
        player.hand = player.hand.concat(this.discardPile);
        this.discardPile = [];
        this.currentPlayerIndex = this.getNextPlayer();
    };
    GameManager.prototype.getGameState = function () {
        return new gameState_1.GameState(this);
    };
    GameManager.prototype.getPlayerState = function (player) {
        var _this = this;
        var blindCards = player.blindCards;
        var mePlayer = (0, typeUtils_1.omitProperty)(player, (0, typeUtils_1.proxiedPropertiesOf)()._blindCards);
        var me = __assign(__assign({}, mePlayer), { blindCards: blindCards });
        return {
            hand: player.hand,
            name: player.name,
            isNominating: me.nominating,
            isNominated: me.nominated,
            otherPlayers: this.playerArray()
                .filter(function (p) { return p !== player; })
                .map(function (p) { return new otherPlayer_1.OtherPlayer(p, _this.getPlayerStatus(p.playerId)); }),
            me: me,
        };
    };
    return GameManager;
}());
exports.GameManager = GameManager;
