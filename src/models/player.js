"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(playerId, name) {
        this.ready = false;
        this.connected = true;
        this._blindCards = [];
        this.bestCards = [];
        this.nominating = false;
        this.nominated = false;
        this.playerId = playerId;
        this.hand = [];
        this.name = name;
        this.connected = true;
        this._blindCards = [];
    }
    Object.defineProperty(Player.prototype, "blindCards", {
        get: function () {
            return this._blindCards.length;
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.addBlindCard = function (card) {
        this._blindCards.push(card);
    };
    Player.prototype.addCardToHand = function (card) {
        this.hand.push(card);
    };
    Player.prototype.nominatePlayer = function () {
        return this;
    };
    Player.prototype.playCard = function (onCards) {
        if (!onCards.length) {
            return this.hand.pop();
        }
        if (!this.hand.some(function (card) { return card.canPlay(onCards); })) {
            return false;
        }
        return this.hand.pop();
    };
    Player.prototype.markReady = function () {
        this.ready = true;
    };
    Player.prototype.removeCardFromHand = function (card) {
        var index = this.hand.findIndex(function (c) { return c.card === card.card && c.suit === card.suit; });
        if (index === -1) {
            return null;
        }
        this.hand.splice(index, 1);
        return card;
    };
    return Player;
}());
exports.Player = Player;
