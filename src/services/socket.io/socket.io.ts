/* eslint-disable react-hooks/rules-of-hooks */
import io, { Socket } from "socket.io-client";
import { SocketEvents } from "../../models/socketEvents";
import { selectRoomModel } from "../../redux/combineSelectors";
import { messageStateActions } from "../../redux/messagesState/messagesStateSlice";
import { ChatMessage } from "../../models/chatMessage";
import { GameState } from "../../models/gameState";
import { gameStateActions } from "../../redux/gameState/gameStateSlice";
import { playerStateActions } from "../../redux/playerState/playerStateSlice";
import { GetMeModel, PlayerState } from "../../models/playerUpdate";
import { EnhancedStore } from "@reduxjs/toolkit";
import { roomStateActions } from "../../redux/roomState/roomStateSlice";
import { JoinRoomModel } from "../../models/joinRoomModel";
import { PlayerWonModel } from "../../models/playerWonModel";
import { CannotPlayCard } from "../../models/cannotPlayCardModel";
import { winnerStateActions } from "../../redux/winnerStateSlice/winnerStateSlice";
import { OtherPlayer } from "../../models/otherPlayer";
import { Room, RoomState } from "../../models/room";
import { logEvent } from "../eventLog/eventLog";
const isProd = process.env.NODE_ENV === "production";


const opts: any = {
  transports: ["websocket"],
  // withCredentials: true,
  forceNew: true,
};

const env = process.env.REACT_APP_ENVIRONMENT;

const rawSocket = process.env.REACT_APP_ENVIRONMENT === 'dev'? io('http://localhost:3000', opts) : io(opts);

const originalEmit = rawSocket.emit.bind(rawSocket);
rawSocket.emit = ((event: string, ...args: any[]) => {
  logEvent("out", event, args.length <= 1 ? args[0] : args);
  return originalEmit(event, ...args);
}) as typeof rawSocket.emit;

const socket = rawSocket;

// export the function to connect and use socket IO:
export const startSocketIO = (store: EnhancedStore<any, any, any>) => {
  socket.connect();
  const dispatch = store.dispatch;

  socket.on("connect", (s) => {
    console.log("connected to server.");
    logEvent("in", "connect");

    socket.on(SocketEvents.MessageSent, (message: ChatMessage[]) => {
      logEvent("in", SocketEvents.MessageSent, message);
      dispatch(messageStateActions.messageSent(message));
    });

    socket.on(SocketEvents.StartGame, (gameState: GameState) => {
      logEvent("in", SocketEvents.StartGame, gameState);
      dispatch(gameStateActions.setGameState(gameState));
    });

    socket.on(SocketEvents.RoomUpdated, (room: RoomState) => {
      logEvent("in", SocketEvents.RoomUpdated, room);
      const getMeModel: GetMeModel = {
        playerId: room.myId,
        roomName: room.roomName,
      };
      socket.emit(SocketEvents.GetMe, getMeModel);
      dispatch(roomStateActions.roomUpdated(room));
    });

    socket.on(SocketEvents.GameUpdate, (gameState: GameState) => {
      logEvent("in", SocketEvents.GameUpdate, gameState);
      dispatch(gameStateActions.setGameState(gameState));
    });

    socket.on(SocketEvents.PlayerUpdate, (playerState: PlayerState) => {
      logEvent("in", SocketEvents.PlayerUpdate, playerState);
      dispatch(playerStateActions.setPlayerState(playerState));
    });

    socket.on(SocketEvents.PlayerWon, (playerWonModel: PlayerWonModel) => {
      logEvent("in", SocketEvents.PlayerWon, playerWonModel);
      dispatch(winnerStateActions.addWinner(playerWonModel.player.playerId));
    });

    socket.on(SocketEvents.CannotPlayCard, (payload: CannotPlayCard) => {
      logEvent("in", SocketEvents.CannotPlayCard, payload);
    });

    return () => {
      socket.off(SocketEvents.MessageSent);
      socket.off(SocketEvents.StartGame);
      socket.off(SocketEvents.GameUpdate);
      socket.off(SocketEvents.PlayerUpdate);
      socket.off(SocketEvents.RoomUpdated);
      socket.off(SocketEvents.CannotPlayCard);
    };
  });
};

export default socket;
