import * as fromActions from './chat.actions';
import { User, Channel, Message } from '../../interfaces/chat.interfaces';

describe('Chat Actions', () => {
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

  describe('App Initialization', () => {
    it('should create initApp action', () => {
      const action = fromActions.initApp();
      expect(action.type).toBe('[Chat] Init App');
    });
  });

  describe('User Actions', () => {
    it('should create setCurrentUser action', () => {
      const action = fromActions.setCurrentUser({ user: testUser });
      expect(action.type).toBe('[Chat] Set Current User');
      expect(action.user).toEqual(testUser);
    });

    it('should create loadUsers action', () => {
      const action = fromActions.loadUsers();
      expect(action.type).toBe('[Chat] Load Users');
    });

    it('should create loadUsersSuccess action', () => {
      const users: User[] = [testUser];
      const action = fromActions.loadUsersSuccess({ users });
      expect(action.type).toBe('[Chat] Load Users Success');
      expect(action.users).toEqual(users);
    });
  });

  describe('Channel Actions', () => {
    it('should create loadChannels action', () => {
      const action = fromActions.loadChannels();
      expect(action.type).toBe('[Chat] Load Channels');
    });

    it('should create loadChannelsSuccess action', () => {
      const channels: Channel[] = [testChannel];
      const action = fromActions.loadChannelsSuccess({ channels });
      expect(action.type).toBe('[Chat] Load Channels Success');
      expect(action.channels).toEqual(channels);
    });

    it('should create createChannel action', () => {
      const name = 'new-channel';
      const action = fromActions.createChannel({ name });
      expect(action.type).toBe('[Chat] Create Channel');
      expect(action.name).toBe(name);
    });

    it('should create createChannelSuccess action', () => {
      const action = fromActions.createChannelSuccess({ channel: testChannel });
      expect(action.type).toBe('[Chat] Create Channel Success');
      expect(action.channel).toEqual(testChannel);
    });

    it('should create createChannelError action', () => {
      const error = 'Error creating channel';
      const action = fromActions.createChannelError({ error });
      expect(action.type).toBe('[Chat] Create Channel Error');
      expect(action.error).toBe(error);
    });

    it('should create selectChannel action', () => {
      const channelId = '1';
      const action = fromActions.selectChannel({ channelId });
      expect(action.type).toBe('[Chat] Select Channel');
      expect(action.channelId).toBe(channelId);
    });

    it('should create loadChannelUsers action', () => {
      const channelId = '1';
      const action = fromActions.loadChannelUsers({ channelId });
      expect(action.type).toBe('[Chat] Load Channel Users');
      expect(action.channelId).toBe(channelId);
    });

    it('should create loadChannelUsersSuccess action', () => {
      const users: User[] = [testUser];
      const action = fromActions.loadChannelUsersSuccess({ users });
      expect(action.type).toBe('[Chat] Load Channel Users Success');
      expect(action.users).toEqual(users);
    });

    it('should create deleteChannel action', () => {
      const channelId = '1';
      const action = fromActions.deleteChannel({ channelId });
      expect(action.type).toBe('[Chat] Delete Channel');
      expect(action.channelId).toBe(channelId);
    });

    it('should create deleteChannelSuccess action', () => {
      const channelId = '1';
      const action = fromActions.deleteChannelSuccess({ channelId });
      expect(action.type).toBe('[Chat] Delete Channel Success');
      expect(action.channelId).toBe(channelId);
    });

    it('should create deleteChannelError action', () => {
      const error = 'Error deleting channel';
      const action = fromActions.deleteChannelError({ error });
      expect(action.type).toBe('[Chat] Delete Channel Error');
      expect(action.error).toBe(error);
    });
  });

  describe('Message Actions', () => {
    it('should create loadMessages action', () => {
      const channelId = '1';
      const action = fromActions.loadMessages({ channelId });
      expect(action.type).toBe('[Chat] Load Messages');
      expect(action.channelId).toBe(channelId);
    });

    it('should create loadMessagesSuccess action', () => {
      const messages: Message[] = [testMessage];
      const action = fromActions.loadMessagesSuccess({ messages });
      expect(action.type).toBe('[Chat] Load Messages Success');
      expect(action.messages).toEqual(messages);
    });

    it('should create loadMessagesError action', () => {
      const error = 'Error loading messages';
      const action = fromActions.loadMessagesError({ error });
      expect(action.type).toBe('[Chat] Load Messages Error');
      expect(action.error).toBe(error);
    });

    it('should create sendMessage action', () => {
      const content = 'Hello world';
      const action = fromActions.sendMessage({ content });
      expect(action.type).toBe('[Chat] Send Message');
      expect(action.content).toBe(content);
    });

    it('should create sendMessageError action', () => {
      const error = 'Error sending message';
      const action = fromActions.sendMessageError({ error });
      expect(action.type).toBe('[Chat] Send Message Error');
      expect(action.error).toBe(error);
    });

    it('should create addMessage action', () => {
      const action = fromActions.addMessage({ message: testMessage });
      expect(action.type).toBe('[Chat] Add Message');
      expect(action.message).toEqual(testMessage);
    });

    it('should create deleteMessage action', () => {
      const messageId = '1';
      const action = fromActions.deleteMessage({ messageId });
      expect(action.type).toBe('[Chat] Delete Message');
      expect(action.messageId).toBe(messageId);
    });

    it('should create deleteMessageSuccess action', () => {
      const messageId = '1';
      const action = fromActions.deleteMessageSuccess({ messageId });
      expect(action.type).toBe('[Chat] Delete Message Success');
      expect(action.messageId).toBe(messageId);
    });

    it('should create deleteMessageError action', () => {
      const error = 'Error deleting message';
      const action = fromActions.deleteMessageError({ error });
      expect(action.type).toBe('[Chat] Delete Message Error');
      expect(action.error).toBe(error);
    });
  });

  describe('Theme Actions', () => {
    it('should create setTheme action', () => {
      const isDark = true;
      const action = fromActions.setTheme({ isDark });
      expect(action.type).toBe('[Chat] Set Theme');
      expect(action.isDark).toBe(isDark);
    });
  });
});
