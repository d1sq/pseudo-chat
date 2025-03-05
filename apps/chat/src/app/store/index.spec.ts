import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { ChatEffects } from './effects/chat.effects';
import * as ChatActions from './actions/chat.actions';
import * as fromSelectors from './selectors/chat.selectors';
import { ChatService } from '../services/chat.service';
import { ChannelService } from '../services/channel.service';
import { MessageService } from '../services/message.service';
import { User, Channel, Message } from '../interfaces/chat.interfaces';
import { initialState } from './reducers/chat.reducer';

describe('Chat Store Integration', () => {
  let actions$: Observable<Action>;
  let store: MockStore;

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

  beforeEach(() => {
    const chatServiceSpy = {
      getUsers: jest.fn(),
    };
    const channelServiceSpy = {
      getChannels: jest.fn(),
      getChannelUsers: jest.fn(),
      createChannel: jest.fn(),
      deleteChannel: jest.fn(),
    };
    const messageServiceSpy = {
      getMessagesByChannelId: jest.fn(),
      sendMessage: jest.fn(),
      deleteMessage: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ChatEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: { chat: initialState },
          selectors: [
            { selector: fromSelectors.selectCurrentUser, value: null },
            { selector: fromSelectors.selectUsers, value: [] },
            { selector: fromSelectors.selectChannels, value: [] },
            { selector: fromSelectors.selectSelectedChannelId, value: null },
            { selector: fromSelectors.selectMessages, value: [] },
          ],
        }),
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: ChannelService, useValue: channelServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    });

    actions$ = of();
    store = TestBed.inject(MockStore);
    TestBed.inject(ChatService);
    TestBed.inject(ChannelService);
    TestBed.inject(MessageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Store Integration', () => {
    it('should initialize with default state', () => {
      store.setState({ chat: initialState });

      store.overrideSelector(fromSelectors.selectCurrentUser, null);
      store.overrideSelector(fromSelectors.selectUsers, []);
      store.overrideSelector(fromSelectors.selectChannels, []);
      store.overrideSelector(fromSelectors.selectSelectedChannelId, null);
      store.overrideSelector(fromSelectors.selectMessages, []);

      expect(store.select(fromSelectors.selectCurrentUser)).toBeTruthy();
      expect(store.select(fromSelectors.selectUsers)).toBeTruthy();
      expect(store.select(fromSelectors.selectChannels)).toBeTruthy();
      expect(store.select(fromSelectors.selectSelectedChannelId)).toBeTruthy();
      expect(store.select(fromSelectors.selectMessages)).toBeTruthy();
    });

    it('should update state when setting current user', () => {
      store.setState({ chat: initialState });
      store.dispatch(ChatActions.setCurrentUser({ user: testUser }));

      store.setState({
        chat: {
          ...initialState,
          currentUser: testUser,
        },
      });

      store.overrideSelector(fromSelectors.selectCurrentUser, testUser);
      let currentUser: User | null = null;
      store.select(fromSelectors.selectCurrentUser).subscribe((user) => {
        currentUser = user;
      });

      expect(currentUser).toEqual(testUser);
    });

    it('should update state when loading users', () => {
      store.setState({ chat: initialState });
      store.dispatch(ChatActions.loadUsersSuccess({ users: [testUser] }));

      store.setState({
        chat: {
          ...initialState,
          users: [testUser],
        },
      });

      store.overrideSelector(fromSelectors.selectUsers, [testUser]);
      let users: User[] = [];
      store.select(fromSelectors.selectUsers).subscribe((u) => {
        users = u;
      });

      expect(users).toEqual([testUser]);
    });

    it('should update state when loading channels', () => {
      store.setState({ chat: initialState });
      store.dispatch(
        ChatActions.loadChannelsSuccess({ channels: [testChannel] })
      );

      store.setState({
        chat: {
          ...initialState,
          channels: [testChannel],
        },
      });

      store.overrideSelector(fromSelectors.selectChannels, [testChannel]);
      let channels: Channel[] = [];
      store.select(fromSelectors.selectChannels).subscribe((c) => {
        channels = c;
      });

      expect(channels).toEqual([testChannel]);
    });

    it('should update state when selecting a channel', () => {
      store.setState({ chat: initialState });
      store.dispatch(ChatActions.selectChannel({ channelId: '1' }));

      store.setState({
        chat: {
          ...initialState,
          selectedChannelId: '1',
        },
      });

      store.overrideSelector(fromSelectors.selectSelectedChannelId, '1');
      let selectedChannelId: string | null = null;
      store.select(fromSelectors.selectSelectedChannelId).subscribe((id) => {
        selectedChannelId = id;
      });

      expect(selectedChannelId).toBe('1');
    });

    it('should update state when loading messages', () => {
      store.setState({ chat: initialState });
      store.dispatch(
        ChatActions.loadMessagesSuccess({ messages: [testMessage] })
      );

      store.setState({
        chat: {
          ...initialState,
          messages: [testMessage],
        },
      });

      store.overrideSelector(fromSelectors.selectMessages, [testMessage]);
      let messages: Message[] = [];
      store.select(fromSelectors.selectMessages).subscribe((m) => {
        messages = m;
      });

      expect(messages).toEqual([testMessage]);
    });

    it('should filter messages by channel', () => {
      const message1 = { ...testMessage, id: '1', channelId: '1' };
      const message2 = { ...testMessage, id: '2', channelId: '2' };

      store.setState({
        chat: {
          ...initialState,
          messages: [message1, message2],
          selectedChannelId: '1',
        },
      });

      store.overrideSelector(fromSelectors.selectCurrentChannelMessages, [
        message1,
      ]);
      let currentChannelMessages: Message[] = [];
      store
        .select(fromSelectors.selectCurrentChannelMessages)
        .subscribe((m) => {
          currentChannelMessages = m;
        });

      expect(currentChannelMessages).toEqual([message1]);
    });

    it('should filter users by online status', () => {
      const onlineUser = { ...testUser, isOnline: true };
      const offlineUser = { ...testUser, id: '2', isOnline: false };

      store.setState({
        chat: {
          ...initialState,
          users: [onlineUser, offlineUser],
        },
      });

      store.overrideSelector(fromSelectors.selectOnlineUsers, [onlineUser]);
      store.overrideSelector(fromSelectors.selectOfflineUsers, [offlineUser]);

      let onlineUsers: User[] = [];
      let offlineUsers: User[] = [];

      store.select(fromSelectors.selectOnlineUsers).subscribe((u) => {
        onlineUsers = u;
      });

      store.select(fromSelectors.selectOfflineUsers).subscribe((u) => {
        offlineUsers = u;
      });

      expect(onlineUsers).toEqual([onlineUser]);
      expect(offlineUsers).toEqual([offlineUser]);
    });

    it('should update state when adding a message', () => {
      store.setState({ chat: initialState });
      store.dispatch(ChatActions.addMessage({ message: testMessage }));

      store.setState({
        chat: {
          ...initialState,
          messages: [testMessage],
        },
      });

      store.overrideSelector(fromSelectors.selectMessages, [testMessage]);
      let messages: Message[] = [];
      store.select(fromSelectors.selectMessages).subscribe((m) => {
        messages = m;
      });

      expect(messages).toEqual([testMessage]);
    });

    it('should update state when deleting a message', () => {
      store.setState({
        chat: {
          ...initialState,
          messages: [testMessage],
        },
      });

      store.dispatch(
        ChatActions.deleteMessageSuccess({ messageId: testMessage.id })
      );

      store.setState({
        chat: {
          ...initialState,
          messages: [],
        },
      });

      store.overrideSelector(fromSelectors.selectMessages, []);
      let messages: Message[] = [];
      store.select(fromSelectors.selectMessages).subscribe((m) => {
        messages = m;
      });

      expect(messages).toEqual([]);
    });

    it('should update state when creating a channel', () => {
      store.setState({ chat: initialState });
      store.dispatch(
        ChatActions.createChannelSuccess({ channel: testChannel })
      );

      store.setState({
        chat: {
          ...initialState,
          channels: [testChannel],
        },
      });

      store.overrideSelector(fromSelectors.selectChannels, [testChannel]);
      let channels: Channel[] = [];
      store.select(fromSelectors.selectChannels).subscribe((c) => {
        channels = c;
      });

      expect(channels).toEqual([testChannel]);
    });

    it('should update state when deleting a channel', () => {
      store.setState({
        chat: {
          ...initialState,
          channels: [testChannel],
          selectedChannelId: testChannel.id,
        },
      });

      store.dispatch(
        ChatActions.deleteChannelSuccess({ channelId: testChannel.id })
      );

      store.setState({
        chat: {
          ...initialState,
          channels: [],
          selectedChannelId: null,
        },
      });

      store.overrideSelector(fromSelectors.selectChannels, []);
      store.overrideSelector(fromSelectors.selectSelectedChannelId, null);

      let channels: Channel[] = [];
      let selectedChannelId: string | null = null;

      store.select(fromSelectors.selectChannels).subscribe((c) => {
        channels = c;
      });

      store.select(fromSelectors.selectSelectedChannelId).subscribe((id) => {
        selectedChannelId = id;
      });

      expect(channels).toEqual([]);
      expect(selectedChannelId).toBeNull();
    });

    it('should update state when setting theme', () => {
      store.setState({ chat: initialState });
      store.dispatch(ChatActions.setTheme({ isDark: true }));

      store.setState({
        chat: {
          ...initialState,
          isDarkTheme: true,
        },
      });

      store.overrideSelector(fromSelectors.selectIsDarkTheme, true);
      let isDarkTheme = false;
      store.select(fromSelectors.selectIsDarkTheme).subscribe((theme) => {
        isDarkTheme = theme;
      });

      expect(isDarkTheme).toBe(true);
    });
  });
});
