import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ChatEffects } from './chat.effects';
import * as ChatActions from '../actions/chat.actions';
import { ChannelService } from '../../services/channel.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { Channel, User } from '../../interfaces/chat.interfaces';
import { selectSelectedChannelId } from '../selectors/chat.selectors';

describe('ChatEffects', () => {
  let actions$: Observable<Action>;
  let effects: ChatEffects;
  let channelService: jest.Mocked<ChannelService>;
  let messageService: jest.Mocked<MessageService>;
  let userService: jest.Mocked<UserService>;
  let store: MockStore;

  const initialState = {
    chat: {
      currentUser: null,
      users: [],
      channels: [],
      messages: [],
      selectedChannelId: '1',
      error: null,
      isDarkTheme: false,
      channelUsers: [],
      isLoadingMessages: false,
      messagesError: null,
      sendMessageError: null,
    },
  };

  const testUser: User = {
    id: '1',
    username: 'test',
    isOnline: true,
  };

  const testChannel: Channel = {
    id: '1',
    name: 'general',
  };

  const testBackendMessage = {
    id: '1',
    content: 'test message',
    from_user: {
      id: '1',
      username: 'test',
      is_online: true,
    },
    timestamp: new Date(),
  };

  beforeEach(() => {
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
    const userServiceSpy = {
      getUsers: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ChatEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        { provide: ChannelService, useValue: channelServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    effects = TestBed.inject(ChatEffects);
    store = TestBed.inject(MockStore);
    channelService = TestBed.inject(
      ChannelService
    ) as jest.Mocked<ChannelService>;
    messageService = TestBed.inject(
      MessageService
    ) as jest.Mocked<MessageService>;
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;

    store.overrideSelector(selectSelectedChannelId, '1');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initApp$', () => {
    it('should return loadChannels action', () => {
      actions$ = of(ChatActions.initApp());

      effects.initApp$.subscribe((action) => {
        expect(action).toEqual(ChatActions.loadChannels());
      });
    });
  });

  describe('loadUsers$', () => {
    it('should return loadUsersSuccess action', () => {
      const users = [testUser];
      userService.getUsers.mockReturnValue(of(users));
      actions$ = of(ChatActions.loadUsers());

      effects.loadUsers$.subscribe((action) => {
        expect(action).toEqual(ChatActions.loadUsersSuccess({ users }));
        expect(userService.getUsers).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const error = new Error('Test error');
      userService.getUsers.mockImplementation(() => throwError(() => error));
      actions$ = of(ChatActions.loadUsers());

      effects.loadUsers$.subscribe((action) => {
        expect(action).toEqual({ type: '[Chat] Load Users Error' });
        expect(userService.getUsers).toHaveBeenCalled();
      });
    });
  });

  describe('loadChannels$', () => {
    it('should return loadChannelsSuccess and selectChannel actions when channels exist', () => {
      const channels = [testChannel];
      channelService.getChannels.mockReturnValue(of(channels));
      actions$ = of(ChatActions.loadChannels());

      let count = 0;
      effects.loadChannels$.subscribe((action) => {
        if (count === 0) {
          expect(action).toEqual(ChatActions.loadChannelsSuccess({ channels }));
        } else {
          expect(action).toEqual(
            ChatActions.selectChannel({ channelId: channels[0].id })
          );
        }
        count++;
        expect(channelService.getChannels).toHaveBeenCalled();
      });
    });

    it('should return only loadChannelsSuccess action when no channels exist', () => {
      const channels: Channel[] = [];
      channelService.getChannels.mockReturnValue(of(channels));
      actions$ = of(ChatActions.loadChannels());

      effects.loadChannels$.subscribe((action) => {
        expect(action).toEqual(ChatActions.loadChannelsSuccess({ channels }));
        expect(channelService.getChannels).toHaveBeenCalled();
      });
    });

    it('should handle error', () => {
      const error = new Error('Test error');
      channelService.getChannels.mockImplementation(() =>
        throwError(() => error)
      );
      actions$ = of(ChatActions.loadChannels());

      effects.loadChannels$.subscribe((action) => {
        expect(action).toEqual({ type: '[Chat] Load Channels Error' });
        expect(channelService.getChannels).toHaveBeenCalled();
      });
    });
  });

  describe('loadChannelUsers$', () => {
    it('should return loadChannelUsersSuccess action', () => {
      const users = [testUser];
      channelService.getChannelUsers.mockReturnValue(of(users));
      actions$ = of(ChatActions.loadChannelUsers({ channelId: '1' }));

      effects.loadChannelUsers$.subscribe((action) => {
        expect(action).toEqual(ChatActions.loadChannelUsersSuccess({ users }));
        expect(channelService.getChannelUsers).toHaveBeenCalledWith('1');
      });
    });

    it('should handle error', () => {
      const error = new Error('Test error');
      channelService.getChannelUsers.mockImplementation(() =>
        throwError(() => error)
      );
      actions$ = of(ChatActions.loadChannelUsers({ channelId: '1' }));

      effects.loadChannelUsers$.subscribe((action) => {
        expect(action).toEqual({ type: '[Chat] Load Channel Users Error' });
        expect(channelService.getChannelUsers).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('loadMessages$', () => {
    it('should return loadMessagesSuccess action with normalized messages', () => {
      const backendMessages = [testBackendMessage];
      messageService.getMessagesByChannelId.mockReturnValue(
        of(backendMessages)
      );
      actions$ = of(ChatActions.loadMessages({ channelId: '1' }));

      effects.loadMessages$.subscribe((action) => {
        expect(action.type).toBe('[Chat] Load Messages Success');
        expect(messageService.getMessagesByChannelId).toHaveBeenCalledWith('1');
      });
    });

    it('should handle error', () => {
      const error = new Error('Test error');
      messageService.getMessagesByChannelId.mockImplementation(() =>
        throwError(() => error)
      );
      actions$ = of(ChatActions.loadMessages({ channelId: '1' }));

      effects.loadMessages$.subscribe((action) => {
        expect(action).toEqual(
          ChatActions.loadMessagesError({ error: error.message })
        );
        expect(messageService.getMessagesByChannelId).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('sendMessage$', () => {
    it('should return addMessage action with normalized message', () => {
      const content = 'test message';
      const backendMessage = testBackendMessage;
      messageService.sendMessage.mockReturnValue(of(backendMessage));
      store.overrideSelector(selectSelectedChannelId, '1');
      actions$ = of(ChatActions.sendMessage({ content }));

      effects.sendMessage$.subscribe((action) => {
        expect(action.type).toBe('[Chat] Add Message');
        expect(messageService.sendMessage).toHaveBeenCalledWith('1', content);
      });
    });

    it('should handle error', () => {
      const content = 'test message';
      const error = new Error('Test error');
      messageService.sendMessage.mockImplementation(() =>
        throwError(() => error)
      );
      store.overrideSelector(selectSelectedChannelId, '1');
      actions$ = of(ChatActions.sendMessage({ content }));

      effects.sendMessage$.subscribe((action) => {
        expect(action).toEqual(
          ChatActions.sendMessageError({ error: error.message })
        );
        expect(messageService.sendMessage).toHaveBeenCalledWith('1', content);
      });
    });

    it('should handle no selected channel', () => {
      const content = 'test message';
      store.overrideSelector(selectSelectedChannelId, null);
      actions$ = of(ChatActions.sendMessage({ content }));

      effects.sendMessage$.subscribe((action) => {
        expect(action).toEqual(
          ChatActions.sendMessageError({ error: 'No channel selected' })
        );
        expect(messageService.sendMessage).not.toHaveBeenCalled();
      });
    });
  });

  describe('selectChannel$', () => {
    it('should return loadMessages and loadChannelUsers actions', () => {
      actions$ = of(ChatActions.selectChannel({ channelId: '1' }));

      let count = 0;
      effects.selectChannel$.subscribe((action) => {
        if (count === 0) {
          expect(action).toEqual(ChatActions.loadMessages({ channelId: '1' }));
        } else {
          expect(action).toEqual(
            ChatActions.loadChannelUsers({ channelId: '1' })
          );
        }
        count++;
      });
    });
  });

  describe('createChannel$', () => {
    it('should return createChannelSuccess action', () => {
      const name = 'test channel';
      channelService.createChannel.mockReturnValue(of(testChannel));
      actions$ = of(ChatActions.createChannel({ name }));

      effects.createChannel$.subscribe((action) => {
        expect(action).toEqual(
          ChatActions.createChannelSuccess({ channel: testChannel })
        );
        expect(channelService.createChannel).toHaveBeenCalledWith(name);
      });
    });

    it('should handle error', () => {
      const name = 'test channel';
      const error = new Error('Test error');
      channelService.createChannel.mockImplementation(() =>
        throwError(() => error)
      );
      actions$ = of(ChatActions.createChannel({ name }));

      effects.createChannel$.subscribe((action) => {
        expect(action).toEqual(
          ChatActions.createChannelError({ error: error.message })
        );
        expect(channelService.createChannel).toHaveBeenCalledWith(name);
      });
    });
  });

  describe('createChannelSuccess$', () => {
    it('should return loadChannels action', () => {
      actions$ = of(ChatActions.createChannelSuccess({ channel: testChannel }));

      effects.createChannelSuccess$.subscribe((action) => {
        expect(action).toEqual(ChatActions.loadChannels());
      });
    });
  });

  describe('deleteChannel$', () => {
    it('should return deleteChannelSuccess action', () => {
      channelService.deleteChannel.mockReturnValue(of(void 0));
      actions$ = of(ChatActions.deleteChannel({ channelId: '1' }));

      effects.deleteChannel$.subscribe((action) => {
        expect(action).toEqual(
          ChatActions.deleteChannelSuccess({ channelId: '1' })
        );
        expect(channelService.deleteChannel).toHaveBeenCalledWith('1');
      });
    });

    it('should handle error', () => {
      const error = new Error('Test error');
      channelService.deleteChannel.mockImplementation(() =>
        throwError(() => error)
      );
      actions$ = of(ChatActions.deleteChannel({ channelId: '1' }));

      effects.deleteChannel$.subscribe((action) => {
        expect(action).toEqual(
          ChatActions.deleteChannelError({ error: error.message })
        );
        expect(channelService.deleteChannel).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('deleteMessage$', () => {
    it('should return deleteMessageSuccess action', () => {
      messageService.deleteMessage.mockReturnValue(of(void 0));
      actions$ = of(ChatActions.deleteMessage({ messageId: '1' }));

      effects.deleteMessage$.subscribe((action) => {
        expect(action).toEqual(
          ChatActions.deleteMessageSuccess({ messageId: '1' })
        );
        expect(messageService.deleteMessage).toHaveBeenCalledWith('1');
      });
    });

    it('should handle error', () => {
      const error = new Error('Test error');
      messageService.deleteMessage.mockImplementation(() =>
        throwError(() => error)
      );
      actions$ = of(ChatActions.deleteMessage({ messageId: '1' }));

      effects.deleteMessage$.subscribe((action) => {
        expect(action).toEqual(
          ChatActions.deleteMessageError({ error: error.message })
        );
        expect(messageService.deleteMessage).toHaveBeenCalledWith('1');
      });
    });
  });
});
