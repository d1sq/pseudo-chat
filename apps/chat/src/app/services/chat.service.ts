import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, Channel, Message } from '../interfaces/chat.interfaces';
import { AppState } from '../store';
import * as ChatSelectors from '../store/selectors/chat.selectors';
import * as ChatActions from '../store/actions/chat.actions';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private store = inject(Store<AppState>);

  getCurrentUser(): Observable<User | null> {
    return this.store.select(ChatSelectors.selectCurrentUser);
  }

  getUsers(): Observable<User[]> {
    return this.store.select(ChatSelectors.selectUsers);
  }

  getChannels(): Observable<Channel[]> {
    return this.store.select(ChatSelectors.selectChannels);
  }

  getSelectedChannel(): Observable<Channel | null> {
    return this.store.select(ChatSelectors.selectSelectedChannel);
  }

  getMessages(): Observable<Message[]> {
    return this.store.select(ChatSelectors.selectCurrentChannelMessages);
  }

  getChannelUsers(): Observable<User[]> {
    return this.store.select(ChatSelectors.selectChannelUsers);
  }

  selectChannel(channelId: string): void {
    this.store.dispatch(ChatActions.selectChannel({ channelId }));
  }

  sendMessage(content: string): void {
    if (!content.trim()) return;
    this.store.dispatch(ChatActions.sendMessage({ content }));
  }
}
