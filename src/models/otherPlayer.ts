import { Player, PlayingPlayer } from "./player";

export class OtherPlayer {
    constructor(player: PlayingPlayer) {
        this.playerId = player.playerId;
        this.name = player.name;
        this.cardsHeld = player.hand.length;
        this.bestCards = player.bestCards.length;
        this.blindCards = player.blindCards;      
        this.isNominated = player.nominated;
        this.isNominating = player.nominating;
    }
    
    playerId: string;
    name: string;
    cardsHeld: number;
    bestCards: number;
    blindCards: number;
    isReady: boolean;
    isNominated: boolean = false;
    isNominating: boolean = false;
}