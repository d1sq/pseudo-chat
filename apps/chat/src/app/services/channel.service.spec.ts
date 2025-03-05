import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChannelService } from './channel.service';
import { Channel, User } from '../interfaces/chat.interfaces';
import { environment } from '../../environments/environment';

describe('ChannelService', () => {
  let service: ChannelService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/channels`;

  const testChannels: Channel[] = [
    { id: '1', name: 'general' },
    { id: '2', name: 'random' },
  ];

  const testBackendUsers = [
    { id: '1', username: 'user1', is_online: true },
    { id: '2', username: 'user2', is_online: false },
  ];

  const testUsers: User[] = [
    { id: '1', username: 'user1', isOnline: true },
    { id: '2', username: 'user2', isOnline: false },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ChannelService,
      ],
    });

    service = TestBed.inject(ChannelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getChannels', () => {
    it('should send a GET request to the correct URL and return the list of channels', () => {
      service.getChannels().subscribe((channels) => {
        expect(channels).toEqual(testChannels);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(testChannels);
    });
  });

  describe('createChannel', () => {
    it('should send a POST request with the correct data and return the new channel', () => {
      const newChannel: Channel = { id: '3', name: 'new-channel' };
      const channelName = 'new-channel';

      service.createChannel(channelName).subscribe((channel) => {
        expect(channel).toEqual(newChannel);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: channelName });
      req.flush(newChannel);
    });
  });

  describe('deleteChannel', () => {
    it('should send a DELETE request to the correct URL', () => {
      const channelId = '1';

      service.deleteChannel(channelId).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/${channelId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getChannelUsers', () => {
    it('should send a GET request to the correct URL and transform the response to User format', () => {
      const channelId = '1';

      service.getChannelUsers(channelId).subscribe((users) => {
        expect(users).toEqual(testUsers);
      });

      const req = httpMock.expectOne(`${apiUrl}/${channelId}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(testBackendUsers);
    });
  });
});
