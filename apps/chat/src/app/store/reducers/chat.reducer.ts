import { createReducer, on } from '@ngrx/store';
import { User, Channel, Message } from '../../interfaces/chat.interfaces';
import * as ChatActions from '../actions/chat.actions';

export const chatFeatureKey = 'chat';

interface BackendUser {
  id: string;
  username: string;
  is_online: boolean;
}

export interface ChatState {
  currentUser: User | null;
  users: User[];
  channels: Channel[];
  selectedChannelId: string | null;
  messages: Message[];
  isDarkTheme: boolean;
  channelUsers: User[];
  isLoadingMessages: boolean;
  messagesError: string | null;
  sendMessageError: string | null;
  error: string | null;
}

export const initialState: ChatState = {
  currentUser: null,
  users: [],
  channels: [],
  selectedChannelId: null,
  messages: [],
  isDarkTheme: false,
  channelUsers: [],
  isLoadingMessages: false,
  messagesError: null,
  sendMessageError: null,
  error: null,
};

export const chatReducer = createReducer(
  initialState,

  on(ChatActions.setCurrentUser, (state, { user }) => ({
    ...state,
    currentUser: user,
  })),

  on(ChatActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
  })),

  on(ChatActions.loadChannelsSuccess, (state, { channels }) => ({
    ...state,
    channels,
  })),

  on(ChatActions.createChannelSuccess, (state, { channel }) => ({
    ...state,
    channels: [...state.channels, channel],
    error: null,
  })),

  on(ChatActions.createChannelError, (state, { error }) => ({
    ...state,
    error,
  })),

  on(ChatActions.selectChannel, (state, { channelId }) => ({
    ...state,
    selectedChannelId: channelId,
  })),

  on(ChatActions.loadChannelUsersSuccess, (state, { users }) => {
    const normalizedUsers = users.map((user: BackendUser | User) => {
      if ('is_online' in user) {
        return {
          id: user.id,
          username: user.username,
          isOnline: user.is_online,
        };
      }
      return user;
    });

    return {
      ...state,
      channelUsers: normalizedUsers,
    };
  }),

  on(ChatActions.loadMessages, (state) => ({
    ...state,
    isLoadingMessages: true,
    messagesError: null,
  })),

  on(ChatActions.loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages,
    isLoadingMessages: false,
  })),

  on(ChatActions.addMessage, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
    sendMessageError: null,
  })),

  on(ChatActions.loadMessagesError, (state, { error }) => ({
    ...state,
    isLoadingMessages: false,
    messagesError: error,
  })),

  on(ChatActions.sendMessageError, (state, { error }) => ({
    ...state,
    sendMessageError: error,
  })),

  on(ChatActions.setTheme, (state, { isDark }) => ({
    ...state,
    isDarkTheme: isDark,
  })),

  on(ChatActions.deleteChannelSuccess, (state, { channelId }) => {
    const updatedChannels = state.channels.filter(
      (channel) => channel.id !== channelId
    );
    return {
      ...state,
      channels: updatedChannels,
      selectedChannelId:
        state.selectedChannelId === channelId
          ? updatedChannels[0]?.id || null
          : state.selectedChannelId,
    };
  }),

  on(ChatActions.deleteChannelError, (state, { error }) => ({
    ...state,
    error,
  })),

  on(ChatActions.deleteMessageSuccess, (state, { messageId }) => ({
    ...state,
    messages: state.messages.filter((message) => message.id !== messageId),
  })),

  on(ChatActions.deleteMessageError, (state, { error }) => ({
    ...state,
    error,
  }))
);
