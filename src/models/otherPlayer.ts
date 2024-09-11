import { Player } from "./player";

export class OtherPlayer {
    /**
     *
     */
    constructor(player: Player, status: string) {
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
    
    playerId: string;
    name: string;
    cardsHeld: number;
    bestCards: number;
    blindCards: number;
    isReady: boolean;
    status: string;
    isNominated: boolean = false;
    isNominating: boolean = false;
}