/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector } from "react-redux";
import { State } from "./state";
import { JoinRoomModel } from "../models/joinRoomModel";
import { useParams } from "react-router-dom";
import { SessionStorage } from "../services/sessionStorage/sessionStorage";

export const selectRoomModel = () => useSelector((state: State): JoinRoomModel | null => {
    let params = useParams();
    
    let roomName = params.roomName || state.room.roomName;
    let playerName = state.playerState?.me?.name || SessionStorage.GetPlayerName();

    return {
        playerName: playerName,
        roomName: roomName
    }
});