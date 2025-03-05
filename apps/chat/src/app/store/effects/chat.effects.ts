import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  map,
  tap,
  withLatestFrom,
  switchMap,
  catchError,
  mergeMap,
} from 'rxjs/operators';
import { of } from 'rxjs';

import * as ChatActions from '../actions/chat.actions';
import { selectSelectedChannelId } from '../selectors/chat.selectors';
import { AppState } from '../index';
import { ChannelService } from '../../services/channel.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';

@Injectable()
export class ChatEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);
  private channelService = inject(ChannelService);
  private messageService = inject(MessageService);
  private userService = inject(UserService);

  initTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.initApp),
      map(() => {
        const savedTheme = localStorage.getItem('theme');
        return ChatActions.setTheme({ isDark: savedTheme === 'dark' });
      })
    )
  );

  initApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.initApp),
      map(() => ChatActions.loadChannels())
    )
  );

  saveTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatActions.setTheme),
        tap(({ isDark }) => {
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          if (isDark) {
            document.body.classList.add('dark-theme');
          } else {
            document.body.classList.remove('dark-theme');
          }
        })
      ),
    { dispatch: false }
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map((users) => ChatActions.loadUsersSuccess({ users })),
          catchError((error) => {
            console.error('Error loading users:', error);
            return of({ type: '[Chat] Load Users Error' });
          })
        )
      )
    )
  );

  loadChannels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadChannels),
      switchMap(() =>
        this.channelService.getChannels().pipe(
          switchMap((channels) => {
            if (channels.length > 0) {
              return of(
                ChatActions.loadChannelsSuccess({ channels }),
                ChatActions.selectChannel({ channelId: channels[0].id })
              );
            }
            return of(ChatActions.loadChannelsSuccess({ channels }));
          }),
          catchError((error) => {
            console.error('Error loading channels:', error);
            return of({ type: '[Chat] Load Channels Error' });
          })
        )
      )
    )
  );

  loadChannelUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadChannelUsers),
      switchMap(({ channelId }) =>
        this.channelService.getChannelUsers(channelId).pipe(
          map((users) => ChatActions.loadChannelUsersSuccess({ users })),
          catchError((error) => {
            console.error('Error loading channel users:', error);
            return of({ type: '[Chat] Load Channel Users Error' });
          })
        )
      )
    )
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadMessages),
      switchMap(({ channelId }) =>
        this.messageService.getMessagesByChannelId(channelId).pipe(
          map((messages) => {
            const normalizedMessages = messages.map((message) => ({
              id: message.id,
              content: message.content,
              channelId,
              fromUser: {
                id: message.from_user.id,
                username: message.from_user.username,
                isOnline: message.from_user.is_online,
              },
              timestamp: message.timestamp,
            }));
            return ChatActions.loadMessagesSuccess({
              messages: normalizedMessages,
            });
          }),
          catchError((error) => {
            console.error('Error loading messages:', error);
            return of(
              ChatActions.loadMessagesError({
                error: error.error?.message || 'Не удалось загрузить сообщения',
              })
            );
          })
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      withLatestFrom(this.store.select(selectSelectedChannelId)),
      switchMap(([{ content }, channelId]) => {
        if (!channelId) {
          console.error('No channel selected');
          return of(ChatActions.sendMessageError({ error: 'Канал не выбран' }));
        }

        return this.messageService.sendMessage(content, channelId).pipe(
          map((message) => {
            const normalizedMessage = {
              id: message.id,
              content: message.content,
              channelId,
              fromUser: {
                id: message.from_user.id,
                username: message.from_user.username,
                isOnline: message.from_user.is_online,
              },
              timestamp: message.timestamp,
            };
            return ChatActions.addMessage({ message: normalizedMessage });
          }),
          catchError((error) => {
            console.error('Error sending message:', error);
            return of(
              ChatActions.sendMessageError({
                error: error.error?.message || 'Не удалось отправить сообщение',
              })
            );
          })
        );
      })
    )
  );

  selectChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.selectChannel),
      switchMap(({ channelId }) => [
        ChatActions.loadMessages({ channelId }),
        ChatActions.loadChannelUsers({ channelId }),
      ])
    )
  );

  createChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.createChannel),
      switchMap(({ name }) =>
        this.channelService.createChannel(name).pipe(
          map((channel) => ChatActions.createChannelSuccess({ channel })),
          catchError((error) =>
            of(
              ChatActions.createChannelError({
                error: error.error?.message || 'Не удалось создать канал',
              })
            )
          )
        )
      )
    )
  );

  createChannelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.createChannelSuccess),
      map(() => ChatActions.loadChannels())
    )
  );

  deleteChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.deleteChannel),
      mergeMap(({ channelId }: { channelId: string }) =>
        this.channelService.deleteChannel(channelId).pipe(
          map(() => ChatActions.deleteChannelSuccess({ channelId })),
          catchError((error) =>
            of(
              ChatActions.deleteChannelError({
                error: error.error?.message || 'Не удалось удалить канал',
              })
            )
          )
        )
      )
    )
  );

  deleteMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.deleteMessage),
      mergeMap(({ messageId }: { messageId: string }) =>
        this.messageService.deleteMessage(messageId).pipe(
          map(() => ChatActions.deleteMessageSuccess({ messageId })),
          catchError((error) =>
            of(
              ChatActions.deleteMessageError({
                error: error.error?.message || 'Не удалось удалить сообщение',
              })
            )
          )
        )
      )
    )
  );
}
