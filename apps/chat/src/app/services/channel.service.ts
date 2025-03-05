import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel, User } from '../interfaces/chat.interface';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

interface BackendUser {
  id: string;
  username: string;
  is_online: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private apiUrl = `${environment.apiUrl}/api/channels`;

  constructor(private http: HttpClient) {}

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(this.apiUrl);
  }

  createChannel(name: string): Observable<Channel> {
    return this.http.post<Channel>(this.apiUrl, { name });
  }

  deleteChannel(channelId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${channelId}`);
  }

  getChannelUsers(channelId: string): Observable<User[]> {
    return this.http
      .get<BackendUser[]>(`${this.apiUrl}/${channelId}/users`)
      .pipe(
        map((users) =>
          users.map((user) => ({
            id: user.id,
            username: user.username,
            isOnline: user.is_online,
          }))
        )
      );
  }
}
