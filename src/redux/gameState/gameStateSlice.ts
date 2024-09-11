/* eslint-disable react-hooks/rules-of-hooks */
import {
  createSlice,
  PayloadAction,
  CaseReducer,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { State } from "../state";
import { GameState, getClientState } from "../../models/gameState";

type GameStateReducer = {
  setGameState: CaseReducer<GameState | null, PayloadAction<GameState>>;
} & SliceCaseReducers<GameState | null>;

const caseReducers: GameStateReducer = {
  setGameState: (state: GameState | null, action: PayloadAction<GameState>) => {
    state = getClientState(action.payload);
    return state;
  },
};

export const gameStateSlice = createSlice<
  GameState | null,
  GameStateReducer,
  string,
  any,
  string
>({
  name: "GameState",
  initialState: null,
  reducers: caseReducers,
});

export const gameStateActions = gameStateSlice.actions;

export const selectGameState = () => {
  return useSelector((state: State) => {
    return state.gameState;
  });
};
// }
//   useSelector((state: State) => state.gameState);

export default gameStateSlice.reducer;
