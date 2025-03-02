import { createAction, props } from '@ngrx/store';
import { User, Channel, Message } from '../../interfaces/chat.interfaces';

// User Actions
export const setCurrentUser = createAction(
  '[Chat] Set Current User',
  props<{ user: User }>()
);

export const loadUsers = createAction('[Chat] Load Users');
export const loadUsersSuccess = createAction(
  '[Chat] Load Users Success',
  props<{ users: User[] }>()
);

// Channel Actions
export const loadChannels = createAction('[Chat] Load Channels');
export const loadChannelsSuccess = createAction(
  '[Chat] Load Channels Success',
  props<{ channels: Channel[] }>()
);

export const selectChannel = createAction(
  '[Chat] Select Channel',
  props<{ channelId: string }>()
);

// Message Actions
export const loadMessages = createAction(
  '[Chat] Load Messages',
  props<{ channelId: string }>()
);

export const loadMessagesSuccess = createAction(
  '[Chat] Load Messages Success',
  props<{ messages: Message[] }>()
);

export const sendMessage = createAction(
  '[Chat] Send Message',
  props<{ content: string }>()
);

export const addMessage = createAction(
  '[Chat] Add Message',
  props<{ message: Message }>()
);

// Theme Actions
export const setTheme = createAction(
  '[Chat] Set Theme',
  props<{ isDark: boolean }>()
); 