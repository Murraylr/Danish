import { Card, CardType } from "./card";
import { Room, RoomState } from "./room";

export interface Turn {
    cards: CardType[];
    playerId: string;
    room: RoomState;
}