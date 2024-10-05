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
const isProd = process.env.NODE_ENV === "production";


const opts: any = {
  transports: ["websocket"],
  // withCredentials: true,
  forceNew: true,
};

const env = process.env.REACT_APP_ENVIRONMENT;

const socket = process.env.REACT_APP_ENVIRONMENT === 'dev'? io('http://localhost:3000', opts) : io(opts);

// export the function to connect and use socket IO:
export const startSocketIO = (store: EnhancedStore<any, any, any>) => {
  socket.connect();
  const dispatch = store.dispatch;

  socket.on("connect", (s) => {
    console.log("connected to server.");

    socket.on(SocketEvents.MessageSent, (message: ChatMessage[]) =>
      dispatch(messageStateActions.messageSent(message))
    );

    socket.on(SocketEvents.StartGame, (gameState: GameState) => {
      dispatch(gameStateActions.setGameState(gameState));
    });

    socket.on(SocketEvents.RoomUpdated, (room: RoomState) => {
      const getMeModel: GetMeModel = {
        playerId: room.myId,
        roomName: room.roomName,
      };
      socket.emit(SocketEvents.GetMe, getMeModel);
      dispatch(roomStateActions.roomUpdated(room));
    });

    socket.on(SocketEvents.GameUpdate, (gameState: GameState) => {
      dispatch(gameStateActions.setGameState(gameState));
    });

    socket.on(SocketEvents.PlayerUpdate, (playerState: PlayerState) => {
      dispatch(playerStateActions.setPlayerState(playerState));
    });

    socket.on(SocketEvents.PlayerWon, (playerWonModel: PlayerWonModel) => {
      dispatch(winnerStateActions.addWinner(playerWonModel.player.playerId));
    });

    return () => {
      socket.off(SocketEvents.MessageSent);
      socket.off(SocketEvents.StartGame);
      socket.off(SocketEvents.GameUpdate);
      socket.off(SocketEvents.PlayerUpdate);
      socket.off(SocketEvents.RoomUpdated);
    };
  });
};

export default socket;
