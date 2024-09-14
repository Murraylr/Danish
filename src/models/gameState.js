"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientGameState = exports.getClientState = exports.GameState = void 0;
var card_1 = require("./card");
var otherPlayer_1 = require("./otherPlayer");
var GameState = /** @class */ (function () {
    /**
     *
     */
    function GameState(gameManager) {
        this.discardPile = [];
        this.pickupDeckNumber = 0;
        this.players = [];
        this.currentPlayer = [];
        this.cardSelectingState = false;
        this.startingPlayers = [];
        this.gameStarted = false;
        if (!gameManager) {
            return;
        }
        this.discardPile = gameManager.discardPile;
        this.pickupDeckNumber = gameManager.deck.length;
        this.players = gameManager
            .playerArray()
            .map(function (p) { return new otherPlayer_1.OtherPlayer(p, gameManager.getPlayerStatus(p.playerId)); });
        this.currentPlayer = gameManager.getCurrentPlayer();
        this.cardSelectingState = gameManager.choosingBestCards;
        this.startingPlayers = gameManager.startingPlayers;
        this.gameStarted = gameManager.gameStarted;
    }
    return GameState;
}());
exports.GameState = GameState;
function getClientState(gameState) {
    return Object.assign(new ClientGameState(), gameState, {
        discardPile: gameState.discardPile.map(function (c) { return (0, card_1.newCard)(c); }),
    });
}
exports.getClientState = getClientState;
var ClientGameState = /** @class */ (function (_super) {
    __extends(ClientGameState, _super);
    function ClientGameState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClientGameState.prototype.isMyTurn = function (player) {
        return this.currentPlayer.some(function (p) { return p.playerId === player.playerId; });
    };
    ClientGameState.prototype.getStatusMessage = function (player) {
        var _a;
        if (!this.gameStarted) {
            return "Waiting for players to click ready";
        }
        if (this.cardSelectingState) {
            return player.bestCards.length < 3 ? "Select your best cards" : "Waiting for others to select cards";
        }
        if (this.startingPlayers.includes(player.playerId)) {
            return "You have the lowest card! Play quick before someone else does!";
        }
        if (this.isMyTurn(player)) {
            if (player.nominated) {
                return "You have been nominated to play a magic card!";
            }
            if (player.nominating) {
                return "Nominate someone to play a magic card";
            }
            return "It's your turn!";
        }
        if (this.currentPlayer.length === 1) {
            return ("It's " +
                ((_a = this.currentPlayer[0]) === null || _a === void 0 ? void 0 : _a.name) +
                "'s turn");
        }
        if (this.currentPlayer.length > 1) {
            return "Waiting for " + this.currentPlayer.map(function (p) { return p.name; }).join(" or ") + " to play";
        }
        return "";
    };
    return ClientGameState;
}(GameState));
exports.ClientGameState = ClientGameState;
