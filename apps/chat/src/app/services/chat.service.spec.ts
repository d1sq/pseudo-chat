import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ChatService } from './chat.service';
import { User, Channel, Message } from '../interfaces/chat.interfaces';
import * as ChatSelectors from '../store/selectors/chat.selectors';
import * as ChatActions from '../store/actions/chat.actions';

describe('ChatService', () => {
  let service: ChatService;
  let store: MockStore;

  const mockUser: User = {
    id: '1',
    username: 'admin',
    isOnline: true,
  };

  const mockUsers: User[] = [
    mockUser,
    { id: '2', username: 'user2', isOnline: false },
  ];

  const mockChannels: Channel[] = [
    { id: '1', name: 'general' },
    { id: '2', name: 'random' },
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      fromUser: mockUser,
      channelId: '1',
      content: 'Test message',
      timestamp: new Date(),
    },
  ];

  const initialState = {
    chat: {
      currentUser: mockUser,
      users: mockUsers,
      channels: mockChannels,
      selectedChannelId: '1',
      messages: mockMessages,
      channelUsers: [mockUser],
      isDarkTheme: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatService, provideMockStore({ initialState })],
    });

    service = TestBed.inject(ChatService);
    store = TestBed.inject(MockStore);

    store.overrideSelector(ChatSelectors.selectCurrentUser, mockUser);
    store.overrideSelector(ChatSelectors.selectUsers, mockUsers);
    store.overrideSelector(ChatSelectors.selectChannels, mockChannels);
    store.overrideSelector(
      ChatSelectors.selectSelectedChannel,
      mockChannels[0]
    );
    store.overrideSelector(
      ChatSelectors.selectCurrentChannelMessages,
      mockMessages
    );
    store.overrideSelector(ChatSelectors.selectChannelUsers, [mockUser]);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentUser', () => {
    it('should return the current user from the store', (done) => {
      service.getCurrentUser().subscribe((user) => {
        expect(user).toEqual(mockUser);
        done();
      });
    });
  });

  describe('getUsers', () => {
    it('should return the list of users from the store', (done) => {
      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
        done();
      });
    });
  });

  describe('getChannels', () => {
    it('should return the list of channels from the store', (done) => {
      service.getChannels().subscribe((channels) => {
        expect(channels).toEqual(mockChannels);
        done();
      });
    });
  });

  describe('selectChannel', () => {
    it('should dispatch the selectChannel action to the store', () => {
      jest.spyOn(store, 'dispatch');
      const channelId = '2';

      service.selectChannel(channelId);

      expect(store.dispatch).toHaveBeenCalledWith(
        ChatActions.selectChannel({ channelId })
      );
    });
  });

  describe('sendMessage', () => {
    it('should dispatch the sendMessage action to the store', () => {
      jest.spyOn(store, 'dispatch');
      const content = 'Test message';

      service.sendMessage(content);

      expect(store.dispatch).toHaveBeenCalledWith(
        ChatActions.sendMessage({ content })
      );
    });

    it('should not dispatch action for empty message', () => {
      jest.spyOn(store, 'dispatch');

      service.sendMessage('   ');

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
