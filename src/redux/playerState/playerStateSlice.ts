/* eslint-disable react-hooks/rules-of-hooks */
import {createSlice, PayloadAction, CaseReducer, SliceCaseReducers} from '@reduxjs/toolkit';
import {useSelector} from 'react-redux';
import {State} from '../state';
import { PlayerState } from '../../models/playerUpdate';
import { newCard } from '../../models/card';
import { CannotPlayCard } from '../../models/cannotPlayCardModel';

export type ReduxPlayerState = {
    playerState?: PlayerState;
    invalidPlay?: CannotPlayCard;
}

type PlayerStateReducer = {
    setPlayerState: CaseReducer<ReduxPlayerState, PayloadAction<PlayerState>>;
    setInvalidPlay: CaseReducer<ReduxPlayerState, PayloadAction<CannotPlayCard>>;
} & SliceCaseReducers<ReduxPlayerState | null>;

const caseReducers: PlayerStateReducer = {
    setPlayerState: (state: (ReduxPlayerState) | null, action: PayloadAction<PlayerState>) => {
        state.playerState = {
            ...action.payload,
            hand: action.payload.hand.map(card => newCard(card))
        };
        return state;
    },
    setInvalidPlay: (state: (ReduxPlayerState) | null, action: PayloadAction<CannotPlayCard | undefined>) => {
        state.invalidPlay = action.payload;
        return state;
    }
}

export const playerStateSlice = createSlice<ReduxPlayerState | null, PlayerStateReducer, string, any, string>({
  name: 'PlayerState',
  initialState: {},
  reducers: caseReducers,
});

export const playerStateActions = playerStateSlice.actions;

export const selectPlayerState = () => useSelector((state: State) => state.playerState.playerState);
export const selectInvalidAction = () => useSelector((state: State) => state.playerState.invalidPlay);

export default playerStateSlice.reducer;
