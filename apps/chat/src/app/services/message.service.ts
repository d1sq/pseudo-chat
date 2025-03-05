import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendMessage } from '../interfaces/chat.interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/api/messages`;

  constructor(private http: HttpClient) {}

  getMessagesByChannelId(channelId: string): Observable<BackendMessage[]> {
    return this.http.get<BackendMessage[]>(
      `${this.apiUrl}/channel/${channelId}`
    );
  }

  sendMessage(content: string, channelId: string): Observable<BackendMessage> {
    return this.http.post<BackendMessage>(this.apiUrl, { content, channelId });
  }

  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }
}
