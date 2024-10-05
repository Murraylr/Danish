/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector } from "react-redux";
import { State } from "./state";
import { JoinRoomModel } from "../models/joinRoomModel";
import { Params, useParams } from "react-router-dom";
import { SessionStorage } from "../services/sessionStorage/sessionStorage";
import { createSelector } from "@reduxjs/toolkit";
import { Room, RoomState } from "../models/room";
import { PlayerState } from "../models/playerUpdate";

const roomModelSelector = createSelector(
  (state: State) => state.room,
  (state: State) => state.playerState.playerState,
  (_, paramsRoomName: string) => paramsRoomName,
  (
    room: RoomState,
    playerState: PlayerState,
    paramsRoomName: string
  ): JoinRoomModel | null => {
    let roomName = paramsRoomName || room.roomName;
    let playerName = playerState?.me?.name || SessionStorage.GetPlayerName();

    return {
      playerName: playerName,
      roomName: roomName,
    };
  }
);

export const selectRoomModel = () => {
    let params = useParams();
    return useSelector((state) => roomModelSelector(state, params.roomName));
}
  
