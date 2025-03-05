import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from '../reducers/chat.reducer';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectCurrentUser = createSelector(
  selectChatState,
  (state) => state.currentUser
);

export const selectUsers = createSelector(
  selectChatState,
  (state) => state.users
);

export const selectChannelUsers = createSelector(
  selectChatState,
  (state) => state.channelUsers
);

export const selectOnlineUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => user.isOnline)
);

export const selectOfflineUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => !user.isOnline)
);

export const selectOnlineChannelUsers = createSelector(
  selectChannelUsers,
  (users) => users.filter((user) => user.isOnline)
);

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
  (state, selectedId) =>
    state.channels.find((channel) => channel.id === selectedId) || null
);

export const selectMessages = createSelector(
  selectChatState,
  (state) => state.messages
);

export const selectCurrentChannelMessages = createSelector(
  selectMessages,
  selectSelectedChannelId,
  (messages, channelId) =>
    channelId ? messages.filter((msg) => msg.channelId === channelId) : []
);

export const selectIsLoadingMessages = createSelector(
  selectChatState,
  (state) => state.isLoadingMessages || false
);

export const selectMessagesError = createSelector(
  selectChatState,
  (state) => state.messagesError || null
);

export const selectSendMessageError = createSelector(
  selectChatState,
  (state) => state.sendMessageError || null
);

export const selectIsDarkTheme = createSelector(
  selectChatState,
  (state) => state.isDarkTheme
);
