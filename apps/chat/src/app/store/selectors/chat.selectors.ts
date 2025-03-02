import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from '../reducers/chat.reducer';

export const selectChatState = createFeatureSelector<ChatState>('chat');

// User selectors
export const selectCurrentUser = createSelector(
  selectChatState,
  (state) => state.currentUser
);

export const selectUsers = createSelector(
  selectChatState,
  (state) => state.users
);

// Channel selectors
export const selectChannels = createSelector(
  selectChatState,
  (state) => state.channels
);

export const selectSelectedChannelId = createSelector(
  selectChatState,
  (state) => state.selectedChannelId
);

export const selectSelectedChannel = createSelector(
  selectChatState,
  selectSelectedChannelId,
  (state, selectedId) => state.channels.find(channel => channel.id === selectedId) || null
);

// Message selectors
export const selectMessages = createSelector(
  selectChatState,
  (state) => state.messages
);

export const selectCurrentChannelMessages = createSelector(
  selectMessages,
  selectSelectedChannelId,
  (messages, channelId) => channelId ? messages.filter(msg => msg.channelId === channelId) : []
);

// Theme selector
export const selectIsDarkTheme = createSelector(
  selectChatState,
  (state) => state.isDarkTheme
); 