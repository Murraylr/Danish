import { Card } from "./card";

export interface BestCardSelection {
    playerId: string;
    cards: Card[];
    roomName: string;
}