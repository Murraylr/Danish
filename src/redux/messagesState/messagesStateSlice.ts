/* eslint-disable react-hooks/rules-of-hooks */
import {createSlice, PayloadAction, CaseReducer, SliceCaseReducers} from '@reduxjs/toolkit';
import {useSelector} from 'react-redux';
import {State} from '../state';
import { ChatMessage } from '../../models/chatMessage';

type ChatMessageReducer = {
    messageSent: CaseReducer<ChatMessage[], PayloadAction<ChatMessage[]>>;
} & SliceCaseReducers<ChatMessage[]>;

const caseReducers: ChatMessageReducer = {
    messageSent: (state: ChatMessage[], action: PayloadAction<ChatMessage[]>) => {
        state = [...action.payload ];
        return state;
    }
};

export const messageStateSlice = createSlice<ChatMessage[], ChatMessageReducer, string, any, string>({
  name: 'MessageState',
  initialState: [],
  reducers: caseReducers,
});

export const messageStateActions = messageStateSlice.actions;

export const selectMessages = () => useSelector((state: State) => state.messages);

export default messageStateSlice.reducer;
