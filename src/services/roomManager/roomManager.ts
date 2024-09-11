import { Room } from "../../models/room";

export class RoomManager {
    rooms: Map<string, Room>;
    constructor() {
        this.rooms = new Map();
    }

    createRoom(roomId: string) {
        let room = new Room(roomId);
        this.rooms.set(roomId, room);
        return room;
    }

    getRoom(roomId: string): Room | undefined {
        return this.rooms.get(roomId);
    }
}