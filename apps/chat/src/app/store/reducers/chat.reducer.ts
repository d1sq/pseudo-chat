import { createReducer, on } from '@ngrx/store';
import { User, Channel, Message } from '../../interfaces/chat.interfaces';
import * as ChatActions from '../actions/chat.actions';

export interface ChatState {
  currentUser: User | null;
  users: User[];
  channels: Channel[];
  selectedChannelId: string | null;
  messages: Message[];
  isDarkTheme: boolean;
}

export const initialState: ChatState = {
  currentUser: null,
  users: [],
  channels: [],
  selectedChannelId: null,
  messages: [],
  isDarkTheme: false
};

export const chatReducer = createReducer(
  initialState,
  
  // User reducers
  on(ChatActions.setCurrentUser, (state, { user }) => ({
    ...state,
    currentUser: user
  })),
  
  on(ChatActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users
  })),
  
  // Channel reducers
  on(ChatActions.loadChannelsSuccess, (state, { channels }) => ({
    ...state,
    channels
  })),
  
  on(ChatActions.selectChannel, (state, { channelId }) => ({
    ...state,
    selectedChannelId: channelId
  })),
  
  // Message reducers
  on(ChatActions.loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages
  })),
  
  on(ChatActions.addMessage, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message]
  })),
  
  // Theme reducer
  on(ChatActions.setTheme, (state, { isDark }) => ({
    ...state,
    isDarkTheme: isDark
  }))
); 