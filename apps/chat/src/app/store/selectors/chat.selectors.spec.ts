import * as fromSelectors from './chat.selectors';
import { ChatState } from '../reducers/chat.reducer';
import { User, Channel, Message } from '../../interfaces/chat.interfaces';

describe('Chat Selectors', () => {
  const testUser1: User = {
    id: '1',
    username: 'user1',
    isOnline: true,
  };

  const testUser2: User = {
    id: '2',
    username: 'user2',
    isOnline: false,
  };

  const testChannel1: Channel = {
    id: '1',
    name: 'general',
  };

  const testChannel2: Channel = {
    id: '2',
    name: 'random',
  };

  const testMessage1: Message = {
    id: '1',
    content: 'message 1',
    channelId: '1',
    fromUser: testUser1,
    timestamp: new Date(),
  };

  const testMessage2: Message = {
    id: '2',
    content: 'message 2',
    channelId: '2',
    fromUser: testUser2,
    timestamp: new Date(),
  };

  const initialState: ChatState = {
    currentUser: testUser1,
    users: [testUser1, testUser2],
    channels: [testChannel1, testChannel2],
    selectedChannelId: '1',
    messages: [testMessage1, testMessage2],
    isDarkTheme: true,
    channelUsers: [testUser1, testUser2],
    isLoadingMessages: false,
    messagesError: null,
    sendMessageError: null,
    error: null,
  };

  describe('selectChatState', () => {
    it('should select the chat state from AppState', () => {
      const appState = { chat: initialState };
      const result = fromSelectors.selectChatState(appState);
      expect(result).toEqual(initialState);
    });
  });

  describe('selectCurrentUser', () => {
    it('should return the current user', () => {
      const result = fromSelectors.selectCurrentUser.projector(initialState);
      expect(result).toEqual(testUser1);
    });

    it('should return null if current user is not set', () => {
      const state = { ...initialState, currentUser: null };
      const result = fromSelectors.selectCurrentUser.projector(state);
      expect(result).toBeNull();
    });
  });

  describe('selectUsers', () => {
    it('should return all users', () => {
      const result = fromSelectors.selectUsers.projector(initialState);
      expect(result).toEqual([testUser1, testUser2]);
    });

    it('should return an empty array if there are no users', () => {
      const state = { ...initialState, users: [] };
      const result = fromSelectors.selectUsers.projector(state);
      expect(result).toEqual([]);
    });
  });

  describe('selectChannelUsers', () => {
    it('should return channel users', () => {
      const result = fromSelectors.selectChannelUsers.projector(initialState);
      expect(result).toEqual([testUser1, testUser2]);
    });

    it('should return an empty array if there are no channel users', () => {
      const state = { ...initialState, channelUsers: [] };
      const result = fromSelectors.selectChannelUsers.projector(state);
      expect(result).toEqual([]);
    });
  });

  describe('selectOnlineUsers', () => {
    it('should return only online users', () => {
      const result = fromSelectors.selectOnlineUsers.projector([
        testUser1,
        testUser2,
      ]);
      expect(result).toEqual([testUser1]);
    });

    it('should return an empty array if there are no online users', () => {
      const offlineUsers = [
        { ...testUser1, isOnline: false },
        { ...testUser2, isOnline: false },
      ];
      const result = fromSelectors.selectOnlineUsers.projector(offlineUsers);
      expect(result).toEqual([]);
    });

    it('should return an empty array if the user list is empty', () => {
      const result = fromSelectors.selectOnlineUsers.projector([]);
      expect(result).toEqual([]);
    });
  });

  describe('selectOfflineUsers', () => {
    it('should return only offline users', () => {
      const result = fromSelectors.selectOfflineUsers.projector([
        testUser1,
        testUser2,
      ]);
      expect(result).toEqual([testUser2]);
    });

    it('should return an empty array if there are no offline users', () => {
      const onlineUsers = [
        { ...testUser1, isOnline: true },
        { ...testUser2, isOnline: true },
      ];
      const result = fromSelectors.selectOfflineUsers.projector(onlineUsers);
      expect(result).toEqual([]);
    });

    it('should return an empty array if the user list is empty', () => {
      const result = fromSelectors.selectOfflineUsers.projector([]);
      expect(result).toEqual([]);
    });
  });

  describe('selectOnlineChannelUsers', () => {
    it('should return only online channel users', () => {
      const result = fromSelectors.selectOnlineChannelUsers.projector([
        testUser1,
        testUser2,
      ]);
      expect(result).toEqual([testUser1]);
    });

    it('should return an empty array if there are no online channel users', () => {
      const offlineUsers = [
        { ...testUser1, isOnline: false },
        { ...testUser2, isOnline: false },
      ];
      const result =
        fromSelectors.selectOnlineChannelUsers.projector(offlineUsers);
      expect(result).toEqual([]);
    });

    it('should return an empty array if the channel user list is empty', () => {
      const result = fromSelectors.selectOnlineChannelUsers.projector([]);
      expect(result).toEqual([]);
    });
  });

  describe('selectChannels', () => {
    it('should return all channels', () => {
      const result = fromSelectors.selectChannels.projector(initialState);
      expect(result).toEqual([testChannel1, testChannel2]);
    });

    it('should return an empty array if there are no channels', () => {
      const state = { ...initialState, channels: [] };
      const result = fromSelectors.selectChannels.projector(state);
      expect(result).toEqual([]);
    });
  });

  describe('selectSelectedChannelId', () => {
    it('should return the ID of the selected channel', () => {
      const result =
        fromSelectors.selectSelectedChannelId.projector(initialState);
      expect(result).toBe('1');
    });

    it('should return null if no channel is selected', () => {
      const state = { ...initialState, selectedChannelId: null };
      const result = fromSelectors.selectSelectedChannelId.projector(state);
      expect(result).toBeNull();
    });
  });

  describe('selectSelectedChannel', () => {
    it('should return the selected channel', () => {
      const result = fromSelectors.selectSelectedChannel.projector(
        initialState,
        '1'
      );
      expect(result).toEqual(testChannel1);
    });

    it('should return null if no channel is selected', () => {
      const result = fromSelectors.selectSelectedChannel.projector(
        initialState,
        null
      );
      expect(result).toBeNull();
    });

    it('should return null if the selected channel does not exist', () => {
      const result = fromSelectors.selectSelectedChannel.projector(
        initialState,
        '999'
      );
      expect(result).toBeNull();
    });

    it('should return null if the channel list is empty', () => {
      const state = { ...initialState, channels: [] };
      const result = fromSelectors.selectSelectedChannel.projector(state, '1');
      expect(result).toBeNull();
    });
  });

  describe('selectMessages', () => {
    it('should return all messages', () => {
      const result = fromSelectors.selectMessages.projector(initialState);
      expect(result).toEqual([testMessage1, testMessage2]);
    });

    it('should return an empty array if there are no messages', () => {
      const state = { ...initialState, messages: [] };
      const result = fromSelectors.selectMessages.projector(state);
      expect(result).toEqual([]);
    });
  });

  describe('selectCurrentChannelMessages', () => {
    it('should return messages for the selected channel', () => {
      const result = fromSelectors.selectCurrentChannelMessages.projector(
        [testMessage1, testMessage2],
        '1'
      );
      expect(result).toEqual([testMessage1]);
    });

    it('should return an empty array if no channel is selected', () => {
      const result = fromSelectors.selectCurrentChannelMessages.projector(
        [testMessage1, testMessage2],
        null
      );
      expect(result).toEqual([]);
    });

    it('should return an empty array if there are no messages for the selected channel', () => {
      const result = fromSelectors.selectCurrentChannelMessages.projector(
        [testMessage1, testMessage2],
        '3'
      );
      expect(result).toEqual([]);
    });
  });

  describe('selectIsLoadingMessages', () => {
    it('should return the loading state for messages', () => {
      const state = { ...initialState, isLoadingMessages: true };
      const result = fromSelectors.selectIsLoadingMessages.projector(state);
      expect(result).toBe(true);
    });

    it('should return false if messages are not loading', () => {
      const result =
        fromSelectors.selectIsLoadingMessages.projector(initialState);
      expect(result).toBe(false);
    });
  });

  describe('selectMessagesError', () => {
    it('should return the messages error', () => {
      const state = {
        ...initialState,
        messagesError: 'Failed to load messages',
      };
      const result = fromSelectors.selectMessagesError.projector(state);
      expect(result).toBe('Failed to load messages');
    });

    it('should return null if there is no messages error', () => {
      const result = fromSelectors.selectMessagesError.projector(initialState);
      expect(result).toBeNull();
    });
  });

  describe('selectIsDarkTheme', () => {
    it('should return the dark theme state', () => {
      const result = fromSelectors.selectIsDarkTheme.projector(initialState);
      expect(result).toBe(true);
    });

    it('should return false if dark theme is not enabled', () => {
      const state = { ...initialState, isDarkTheme: false };
      const result = fromSelectors.selectIsDarkTheme.projector(state);
      expect(result).toBe(false);
    });
  });
});
