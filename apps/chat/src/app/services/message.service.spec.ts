import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from './message.service';
import { environment } from '../../environments/environment';
import { Message } from '../interfaces/chat.interfaces';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/messages`;

  const testMessages: Message[] = [
    {
      id: '1',
      content: 'Test message 1',
      channelId: '1',
      fromUser: { id: '1', username: 'user1', isOnline: true },
      timestamp: new Date(),
    },
    {
      id: '2',
      content: 'Test message 2',
      channelId: '1',
      fromUser: { id: '2', username: 'user2', isOnline: false },
      timestamp: new Date(),
    },
  ];

  const newMessage: Message = {
    id: '3',
    content: 'New message',
    channelId: '1',
    fromUser: { id: '1', username: 'user1', isOnline: true },
    timestamp: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
      ],
    });

    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMessagesByChannelId', () => {
    it('should send a GET request to the correct URL and return the channel messages', () => {
      const channelId = '1';

      service.getMessagesByChannelId(channelId).subscribe((messages) => {
        expect(messages).toEqual(testMessages);
      });

      const req = httpMock.expectOne(`${apiUrl}/channel/${channelId}`);
      expect(req.request.method).toBe('GET');
      req.flush(testMessages);
    });
  });

  describe('sendMessage', () => {
    it('should send a POST request with the correct data and return the new message', () => {
      const content = 'New message';
      const channelId = '1';

      service.sendMessage(content, channelId).subscribe((message) => {
        expect(message).toEqual(newMessage);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ content, channelId });
      req.flush(newMessage);
    });
  });

  describe('deleteMessage', () => {
    it('should send a DELETE request to the correct URL', () => {
      const messageId = '1';

      service.deleteMessage(messageId).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/${messageId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
