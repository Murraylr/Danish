/* eslint-disable react-hooks/rules-of-hooks */
import {createSlice, PayloadAction, CaseReducer, SliceCaseReducers} from '@reduxjs/toolkit';
import {useSelector} from 'react-redux';
import {State} from '../state';
import { PlayerState } from '../../models/playerUpdate';
import { newCard } from '../../models/card';



type PlayerStateReducer = {
    setPlayerState: CaseReducer<PlayerState | null, PayloadAction<PlayerState>>;
} & SliceCaseReducers<PlayerState | null>;

const caseReducers: PlayerStateReducer = {
    setPlayerState: (state: PlayerState | null, action: PayloadAction<PlayerState>) => {
        state = {
            ...action.payload,
            hand: action.payload.hand.map(card => newCard(card))
        };
        return state;
    }
}

export const playerStateSlice = createSlice<PlayerState | null, PlayerStateReducer, string, any, string>({
  name: 'PlayerState',
  initialState: null,
  reducers: caseReducers,
});

export const playerStateActions = playerStateSlice.actions;

export const selectPlayerState = () => useSelector((state: State) => state.playerState);

export default playerStateSlice.reducer;
