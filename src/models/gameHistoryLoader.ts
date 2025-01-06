import { GameHistory } from "../services/gameHistory/gameHistory";

export interface GameHistoryLoader {
    gameHistory: GameHistory;
    moveNumber: number;
}