"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
var room_1 = require("../../models/room");
var RoomManager = /** @class */ (function () {
    function RoomManager() {
        this.rooms = new Map();
    }
    RoomManager.prototype.createRoom = function (roomId) {
        var room = new room_1.Room(roomId);
        this.rooms.set(roomId, room);
        return room;
    };
    RoomManager.prototype.getRoom = function (roomId) {
        return this.rooms.get(roomId);
    };
    return RoomManager;
}());
exports.RoomManager = RoomManager;
