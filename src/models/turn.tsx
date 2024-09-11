import { Card } from "./card";
import { Room } from "./room";

export interface Turn {
    cards: Card[];
    playerId: string;
    room: Room;
}