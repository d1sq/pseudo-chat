import { ChatState, chatReducer, initialState } from './chat.reducer';
import * as ChatActions from '../actions/chat.actions';
import { User, Channel, Message } from '../../interfaces/chat.interfaces';

describe('Chat Reducer', () => {
  const testUser: User = {
    id: '1',
    username: 'testUser',
    isOnline: true,
  };

  const testChannel: Channel = {
    id: '1',
    name: 'general',
  };

  const testMessage: Message = {
    id: '1',
    content: 'test message',
    channelId: '1',
    fromUser: testUser,
    timestamp: new Date(),
  };

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = chatReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('setCurrentUser action', () => {
    it('should update currentUser in state', () => {
      const action = ChatActions.setCurrentUser({ user: testUser });
      const state = chatReducer(initialState, action);

      expect(state.currentUser).toEqual(testUser);
    });
  });

  describe('loadUsersSuccess action', () => {
    it('should update users in state', () => {
      const users: User[] = [testUser];
      const action = ChatActions.loadUsersSuccess({ users });
      const state = chatReducer(initialState, action);

      expect(state.users).toEqual(users);
    });
  });

  describe('loadChannelsSuccess action', () => {
    it('should update channels in state', () => {
      const channels: Channel[] = [testChannel];
      const action = ChatActions.loadChannelsSuccess({ channels });
      const state = chatReducer(initialState, action);

      expect(state.channels).toEqual(channels);
    });
  });

  describe('createChannelSuccess action', () => {
    it('should add new channel to state', () => {
      const initialStateWithChannels: ChatState = {
        ...initialState,
        channels: [{ id: '2', name: 'random' }],
      };

      const action = ChatActions.createChannelSuccess({ channel: testChannel });
      const state = chatReducer(initialStateWithChannels, action);

      expect(state.channels.length).toBe(2);
      expect(state.channels).toContainEqual(testChannel);
      expect(state.error).toBeNull();
    });
  });

  describe('createChannelError action', () => {
    it('should update error in state', () => {
      const error = 'Failed to create channel';
      const action = ChatActions.createChannelError({ error });
      const state = chatReducer(initialState, action);

      expect(state.error).toBe(error);
    });
  });

  describe('selectChannel action', () => {
    it('should update selectedChannelId in state', () => {
      const channelId = '1';
      const action = ChatActions.selectChannel({ channelId });
      const state = chatReducer(initialState, action);

      expect(state.selectedChannelId).toBe(channelId);
    });
  });

  describe('loadChannelUsersSuccess action', () => {
    it('should update channelUsers in state', () => {
      const users: User[] = [testUser];
      const action = ChatActions.loadChannelUsersSuccess({ users });
      const state = chatReducer(initialState, action);

      expect(state.channelUsers).toEqual(users);
    });

    it('should normalize backend users', () => {
      const backendUsers = [{ id: '1', username: 'testUser', is_online: true }];
      const action = ChatActions.loadChannelUsersSuccess({
        users: backendUsers as any,
      });
      const state = chatReducer(initialState, action);

      expect(state.channelUsers).toEqual([
        {
          id: '1',
          username: 'testUser',
          isOnline: true,
        },
      ]);
    });
  });

  describe('loadMessages action', () => {
    it('should set isLoadingMessages to true', () => {
      const action = ChatActions.loadMessages({ channelId: '1' });
      const state = chatReducer(initialState, action);

      expect(state.isLoadingMessages).toBe(true);
      expect(state.messagesError).toBeNull();
    });
  });

  describe('loadMessagesSuccess action', () => {
    it('should update messages and set isLoadingMessages to false', () => {
      const messages: Message[] = [testMessage];
      const action = ChatActions.loadMessagesSuccess({ messages });
      const state = chatReducer(initialState, action);

      expect(state.messages).toEqual(messages);
      expect(state.isLoadingMessages).toBe(false);
    });
  });

  describe('addMessage action', () => {
    it('should add new message to state', () => {
      const initialStateWithMessages: ChatState = {
        ...initialState,
        messages: [{ ...testMessage, id: '2' }],
      };

      const action = ChatActions.addMessage({ message: testMessage });
      const state = chatReducer(initialStateWithMessages, action);

      expect(state.messages.length).toBe(2);
      expect(state.messages).toContainEqual(testMessage);
      expect(state.sendMessageError).toBeNull();
    });
  });

  describe('loadMessagesError action', () => {
    it('should update messagesError and set isLoadingMessages to false', () => {
      const error = 'Failed to load messages';
      const action = ChatActions.loadMessagesError({ error });
      const state = chatReducer(initialState, action);

      expect(state.messagesError).toBe(error);
      expect(state.isLoadingMessages).toBe(false);
    });
  });

  describe('sendMessageError action', () => {
    it('should update sendMessageError in state', () => {
      const error = 'Failed to send message';
      const action = ChatActions.sendMessageError({ error });
      const state = chatReducer(initialState, action);

      expect(state.sendMessageError).toBe(error);
    });
  });

  describe('setTheme action', () => {
    it('should update isDarkTheme in state', () => {
      const action = ChatActions.setTheme({ isDark: true });
      const state = chatReducer(initialState, action);

      expect(state.isDarkTheme).toBe(true);
    });
  });

  describe('deleteChannelSuccess action', () => {
    it('should remove channel from state', () => {
      const initialStateWithChannels: ChatState = {
        ...initialState,
        channels: [testChannel, { id: '2', name: 'random' }],
        selectedChannelId: '1',
      };

      const action = ChatActions.deleteChannelSuccess({ channelId: '1' });
      const state = chatReducer(initialStateWithChannels, action);

      expect(state.channels.length).toBe(1);
      expect(state.channels[0].id).toBe('2');
      expect(state.selectedChannelId).toBe('2');
    });

    it('should set selectedChannelId to null if no channels left', () => {
      const initialStateWithChannels: ChatState = {
        ...initialState,
        channels: [testChannel],
        selectedChannelId: '1',
      };

      const action = ChatActions.deleteChannelSuccess({ channelId: '1' });
      const state = chatReducer(initialStateWithChannels, action);

      expect(state.channels.length).toBe(0);
      expect(state.selectedChannelId).toBeNull();
    });
  });

  describe('deleteMessageSuccess action', () => {
    it('should remove message from state', () => {
      const initialStateWithMessages: ChatState = {
        ...initialState,
        messages: [testMessage, { ...testMessage, id: '2' }],
      };

      const action = ChatActions.deleteMessageSuccess({ messageId: '1' });
      const state = chatReducer(initialStateWithMessages, action);

      expect(state.messages.length).toBe(1);
      expect(state.messages[0].id).toBe('2');
    });
  });
});
