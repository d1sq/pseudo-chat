import { createAction, props } from '@ngrx/store';
import { User, Channel, Message } from '../../interfaces/chat.interface';

export const initApp = createAction('[Chat] Init App');

export const setCurrentUser = createAction(
  '[Chat] Set Current User',
  props<{ user: User }>()
);

export const loadUsers = createAction('[Chat] Load Users');

export const loadUsersSuccess = createAction(
  '[Chat] Load Users Success',
  props<{ users: User[] }>()
);

export const loadChannels = createAction('[Chat] Load Channels');

export const loadChannelsSuccess = createAction(
  '[Chat] Load Channels Success',
  props<{ channels: Channel[] }>()
);

export const createChannel = createAction(
  '[Chat] Create Channel',
  props<{ name: string }>()
);

export const createChannelSuccess = createAction(
  '[Chat] Create Channel Success',
  props<{ channel: Channel }>()
);

export const createChannelError = createAction(
  '[Chat] Create Channel Error',
  props<{ error: string }>()
);

export const selectChannel = createAction(
  '[Chat] Select Channel',
  props<{ channelId: string }>()
);

export const loadChannelUsers = createAction(
  '[Chat] Load Channel Users',
  props<{ channelId: string }>()
);

export const loadChannelUsersSuccess = createAction(
  '[Chat] Load Channel Users Success',
  props<{ users: User[] }>()
);

export const loadMessages = createAction(
  '[Chat] Load Messages',
  props<{ channelId: string }>()
);

export const loadMessagesSuccess = createAction(
  '[Chat] Load Messages Success',
  props<{ messages: Message[] }>()
);

export const loadMessagesError = createAction(
  '[Chat] Load Messages Error',
  props<{ error: string }>()
);

export const sendMessage = createAction(
  '[Chat] Send Message',
  props<{ content: string }>()
);

export const sendMessageError = createAction(
  '[Chat] Send Message Error',
  props<{ error: string }>()
);

export const addMessage = createAction(
  '[Chat] Add Message',
  props<{ message: Message }>()
);

export const setTheme = createAction(
  '[Chat] Set Theme',
  props<{ isDark: boolean }>()
);

export const deleteChannel = createAction(
  '[Chat] Delete Channel',
  props<{ channelId: string }>()
);

export const deleteChannelSuccess = createAction(
  '[Chat] Delete Channel Success',
  props<{ channelId: string }>()
);

export const deleteChannelError = createAction(
  '[Chat] Delete Channel Error',
  props<{ error: string }>()
);

export const deleteMessage = createAction(
  '[Chat] Delete Message',
  props<{ messageId: string }>()
);

export const deleteMessageSuccess = createAction(
  '[Chat] Delete Message Success',
  props<{ messageId: string }>()
);

export const deleteMessageError = createAction(
  '[Chat] Delete Message Error',
  props<{ error: string }>()
);
