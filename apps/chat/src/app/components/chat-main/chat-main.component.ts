import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Channel, Message, User } from '../../interfaces/chat.interface';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as ChatActions from '../../store/actions/chat.actions';
import * as ChatSelectors from '../../store/selectors/chat.selectors';
import { AppState } from '../../store';

@Component({
  selector: 'app-chat-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss'],
})
export class ChatMainComponent implements OnInit, OnDestroy {
  @Input() selectedChannel: Channel | null = null;

  messages$: Observable<Message[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  sendError$: Observable<string | null>;
  currentUser$: Observable<User | null>;

  newMessage = '';
  private subscriptions: Subscription = new Subscription();
  private store = inject(Store<AppState>);

  constructor() {
    this.messages$ = this.store.select(
      ChatSelectors.selectCurrentChannelMessages
    );
    this.isLoading$ = this.store.select(ChatSelectors.selectIsLoadingMessages);
    this.error$ = this.store.select(ChatSelectors.selectMessagesError);
    this.sendError$ = this.store.select(ChatSelectors.selectSendMessageError);
    this.currentUser$ = this.store.select(ChatSelectors.selectCurrentUser);
  }

  ngOnInit() {
    this.subscriptions.add(
      this.store
        .select(ChatSelectors.selectSelectedChannel)
        .subscribe((channel) => {
          if (channel) {
            this.selectedChannel = channel;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.store.dispatch(
        ChatActions.sendMessage({ content: this.newMessage.trim() })
      );
      this.newMessage = '';
    }
  }

  deleteMessage(messageId: string): void {
    if (confirm('Вы уверены, что хотите удалить это сообщение?')) {
      this.store.dispatch(ChatActions.deleteMessage({ messageId }));
    }
  }
}
