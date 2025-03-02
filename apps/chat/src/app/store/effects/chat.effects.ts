import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import * as ChatActions from '../actions/chat.actions';
import { selectSelectedChannelId } from '../selectors/chat.selectors';
import { AppState } from '../index';
import { ChatService } from '../../services/chat.service';

@Injectable()
export class ChatEffects {

  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);
  private chatService = inject(ChatService);

  constructor() {}


  loadUsers$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ChatActions.loadUsers),
      map(() => {
        const users = this.chatService.getUsers();
        return ChatActions.loadUsersSuccess({ users });
      })
    )
  );

  loadChannels$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ChatActions.loadChannels),
      map(() => {
        const channels = this.chatService.getChannels();
        return ChatActions.loadChannelsSuccess({ channels });
      })
    )
  );

  loadMessages$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ChatActions.loadMessages),
      map(({ channelId }) => {
        const messages = this.chatService.getChannelMessages(channelId);
        return ChatActions.loadMessagesSuccess({ messages });
      })
    )
  );

  sendMessage$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      withLatestFrom(this.store.select(selectSelectedChannelId)),
      map(([{ content }, channelId]) => {
        if (!channelId) {
          console.error('No channel selected');
          return { type: '[Chat] Send Message Error' };
        }
        
        const message = {
          id: Date.now().toString(),
          content,
          channelId,
          fromUser: this.chatService.getCurrentUser(),
          timestamp: new Date()
        };
        
        return ChatActions.addMessage({ message });
      })
    )
  );
} 