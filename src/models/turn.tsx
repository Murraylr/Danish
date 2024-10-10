import { Card, CardType } from "./card";
import { Room } from "./room";

export interface Turn {
    cards: CardType[];
    playerId: string;
    room: Room;
}