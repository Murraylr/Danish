/* eslint-disable react-hooks/rules-of-hooks */
import { createSlice, Slice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { State } from "../state";
import { Room, RoomState } from "../../models/room";

const caseReducers: any = {
  roomUpdated: (state: RoomState, action: PayloadAction<RoomState>) => {
    state = action.payload;
    return state;
  },
};

export const roomStateSlice: Slice = createSlice<
  RoomState | null,
  any,
  string,
  any,
  string
>({
  name: "RoomState",
  initialState: null,
  reducers: caseReducers,
});

export const roomStateActions = roomStateSlice.actions;

export const selectRoom = () => useSelector((state: State) => state.room);

export default roomStateSlice.reducer;
