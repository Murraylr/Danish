import { Card, CardType } from "./card";

export interface BestCardSelection {
    playerId: string;
    cards: CardType[];
    roomName: string;
}