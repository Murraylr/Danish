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
import { GameManager } from "../../services/gameManager/gameManager";
import { Player } from "../../models/player";
import { PlayerWonModel } from "../../models/playerWonModel";
import { OtherPlayer } from "../../models/otherPlayer";
import { uniq, uniqBy } from "lodash";

export type WinnerState = {
  winnerIds: string[];
};

type WinnerStateReducer = {
  addWinner: CaseReducer<WinnerState, PayloadAction<string>>;
} & SliceCaseReducers<WinnerState>;

const caseReducers: WinnerStateReducer = {
  addWinner: (state: WinnerState, action: PayloadAction<string>) => {
    state.winnerIds = uniq([...state.winnerIds, action.payload]);
    return state;
  },
};

export const winnerStateSlice = createSlice<
  WinnerState,
  WinnerStateReducer,
  string,
  any,
  string
>({
  name: "WinnerState",
  initialState: {
    winnerIds: [],
  },
  reducers: caseReducers,
});

export const winnerStateActions = winnerStateSlice.actions;

export const selectWinners = () => {
  return useSelector((state: State) => {
    return state.winners;
  });
};

export default winnerStateSlice.reducer;
