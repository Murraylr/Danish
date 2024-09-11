import { Card } from "./card";
import { OtherPlayer } from "./otherPlayer";
import { Player, VisiblePlayer } from "./player";

export interface PlayerState {
  hand: Card[];
  name: string;
  isNominating: boolean;
  isNominated: boolean;
  otherPlayers: OtherPlayer[];
  me: VisiblePlayer;
}

export interface PlayerReady {
    roomName: string;
    playerId: string;
    ready: boolean;
}

export interface GetMeModel {
    roomName: string;
    playerId: string;
}
