import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from '../reducers/chat.reducer';

export const selectChatState = createFeatureSelector<ChatState>('chat');

// User selectors
export const selectCurrentUser = createSelector(
  selectChatState,
  (state: ChatState) => state.currentUser
);

export const selectUsers = createSelector(
  selectChatState,
  (state: ChatState) => state.users
);

// Channel selectors
export const selectChannels = createSelector(
  selectChatState,
  (state: ChatState) => state.channels
);

export const selectSelectedChannelId = createSelector(
  selectChatState,
  (state: ChatState) => state.selectedChannelId
);

export const selectSelectedChannel = createSelector(
  selectChannels,
  selectSelectedChannelId,
  (channels, selectedId) => channels.find(channel => channel.id === selectedId) || null
);

// Message selectors
export const selectAllMessages = createSelector(
  selectChatState,
  (state: ChatState) => state.messages
);

export const selectCurrentChannelMessages = createSelector(
  selectAllMessages,
  selectSelectedChannelId,
  (messages, channelId) => messages.filter(message => message.channelId === channelId)
);

// Theme selector
export const selectIsDarkTheme = createSelector(
  selectChatState,
  (state: ChatState) => state.isDarkTheme
); 