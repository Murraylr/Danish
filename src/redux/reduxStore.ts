import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "./gameState/gameStateSlice";
import playerStateReducer from "./playerState/playerStateSlice";
import roomStateReducer from "./roomState/roomStateSlice";
import messageStateReducer from "./messagesState/messagesStateSlice";

export default configureStore({
  reducer: {
    gameState: gameStateReducer,
    playerState: playerStateReducer,
    room: roomStateReducer,
    messages: messageStateReducer,
  },
});
