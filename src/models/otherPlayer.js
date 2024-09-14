"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherPlayer = void 0;
var OtherPlayer = /** @class */ (function () {
    /**
     *
     */
    function OtherPlayer(player, status) {
        this.isNominated = false;
        this.isNominating = false;
        this.playerId = player.playerId;
        this.name = player.name;
        this.cardsHeld = player.hand.length;
        this.bestCards = player.bestCards.length;
        this.blindCards = player.blindCards;
        this.isReady = player.ready;
        this.status = status;
        this.isNominated = player.nominated;
        this.isNominating = player.nominating;
    }
    return OtherPlayer;
}());
exports.OtherPlayer = OtherPlayer;
