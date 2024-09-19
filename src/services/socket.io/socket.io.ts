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
const isProd = process.env.NODE_ENV === "production";


const opts: any = {
  transports: ["websocket"],
  // withCredentials: true,
  forceNew: true,
};

const socket = io(opts);

// const socket = io('http://localhost:3000', opts && {
//   forceNew: true,
// });

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

    socket.on(SocketEvents.RoomJoined, (room: JoinRoomModel) => {
      console.log("Room joined: ", room);
      const getMeModel: GetMeModel = {
        playerId: room.playerId,
        roomName: room.roomName,
      };
      
      socket.emit(SocketEvents.GetMe, getMeModel);
      dispatch(roomStateActions.joinRoom(room));
    });

    socket.on(SocketEvents.GameUpdate, (gameState: GameState) => {
      console.log('Updating game state: ', gameState);
      dispatch(gameStateActions.setGameState(gameState));
    });

    socket.on(SocketEvents.PlayerUpdate, (playerState: PlayerState) => {
      console.log('Updating player state: ', playerState);
      dispatch(playerStateActions.setPlayerState(playerState));
    });

    socket.on(SocketEvents.CannotPlayCard, (cannotPlayCardModel: CannotPlayCard) => {
      console.log('Cannot play card: ', cannotPlayCardModel);
      dispatch(playerStateActions.setInvalidPlay(cannotPlayCardModel));
      setTimeout(() => {
        dispatch(playerStateActions.setInvalidPlay(null));
      });
    });

    socket.on(SocketEvents.PlayerWon, (playerWonModel: PlayerWonModel) => {
      dispatch(gameStateActions.playerWon(playerWonModel));
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
