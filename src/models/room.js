"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var gameManager_1 = require("../services/gameManager/gameManager");
var Room = /** @class */ (function () {
    /**
     *
     */
    function Room(roomName) {
        this.messages = [];
        this.gameManager = new gameManager_1.GameManager();
        this.roomName = roomName;
    }
    Room.prototype.addPlayer = function (player) {
        this.gameManager.addPlayer(player);
    };
    Room.prototype.addSystemMessage = function (message) {
        this.messages.push({
            message: message,
            sender: 'System',
            roomName: this.roomName,
        });
    };
    Room.prototype.addMessage = function (sender, message) {
        this.messages.push({
            message: message,
            sender: sender,
            roomName: this.roomName,
        });
    };
    return Room;
}());
exports.Room = Room;
