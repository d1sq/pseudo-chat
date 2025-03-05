import { ActionReducerMap } from '@ngrx/store';
import { ChatState, chatReducer } from './reducers/chat.reducer';

export interface AppState {
  chat: ChatState;
}

export const reducers: ActionReducerMap<AppState> = {
  chat: chatReducer,
};
