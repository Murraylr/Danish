/* eslint-disable react-hooks/rules-of-hooks */
import io from "socket.io-client";
import { SocketEvents } from "../../models/socketEvents";
import { selectRoomModel } from "../../redux/combineSelectors";
import { useDispatch } from "react-redux";
import { messageStateActions } from "../../redux/messagesState/messagesStateSlice";
import { ChatMessage } from "../../models/chatMessage";
import { GameState } from "../../models/gameState";
import { gameStateActions } from "../../redux/gameState/gameStateSlice";
import { playerStateActions } from "../../redux/playerState/playerStateSlice";
import { PlayerState } from "../../models/playerUpdate";
import { EnhancedStore } from "@reduxjs/toolkit";
import { SessionStorage } from "../sessionStorage/sessionStorage";
import { Cookie } from "express-session";
import { Room } from "../../models/room";
import { roomStateActions } from "../../redux/roomState/roomStateSlice";
import { JoinRoomModel } from "../../models/joinRoomModel";
const isProd = process.env.NODE_ENV === "production";

const opts: any = {
  transports: ["websocket"],
  withCredentials: true,
};

const socket = io(opts);

// export the function to connect and use socket IO:
export const startSocketIO = (store: EnhancedStore<any, any, any>) => {
  socket.connect();
  const dispatch = store.dispatch;

  socket.on("connect", () => {
    console.log("connected to server.");

    // socket.on("disconnect", () => {
    //   const roomModel = selectRoomModel();
    //   socket.emit(SocketEvents.LeaveRoom, roomModel);
    // });

    socket.on(SocketEvents.MessageSent, (message: ChatMessage[]) =>
      dispatch(messageStateActions.messageSent(message))
    );

    socket.on(SocketEvents.StartGame, (gameState: GameState) => {
      dispatch(gameStateActions.setGameState(gameState));
    });

    socket.on(SocketEvents.RoomJoined, (room: Room) => {
      console.log("HEEEEERE");
      dispatch(roomStateActions.joinRoom(room));
    });

    socket.on(SocketEvents.GameUpdate, (gameState: GameState) => {
      dispatch(gameStateActions.setGameState(gameState));
    });

    socket.on(SocketEvents.PlayerUpdate, (playerState: PlayerState) => {
      dispatch(playerStateActions.setPlayerState(playerState));
    });

    return () => {
      socket.off(SocketEvents.MessageSent);
      socket.off(SocketEvents.StartGame);
      socket.off(SocketEvents.GameUpdate);
      socket.off(SocketEvents.PlayerUpdate);
      socket.off(SocketEvents.RoomJoined);
    };
  });
};

export default socket;
