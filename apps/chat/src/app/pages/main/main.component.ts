import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User, Channel, Message } from '../../interfaces/chat.interfaces';
import * as ChatActions from '../../store/actions/chat.actions';
import * as ChatSelectors from '../../store/selectors/chat.selectors';
import { AppState } from '../../store';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ChatMainComponent } from '../../components/chat-main/chat-main.component';
import { ChatSidebarComponent } from '../../components/chat-sidebar/chat-sidebar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatMainComponent, ChatSidebarComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store<AppState>);

  currentUser$: Observable<User | null>;
  users$: Observable<User[]>;
  channels$: Observable<Channel[]>;
  selectedChannel$: Observable<Channel | null>;
  messages$: Observable<Message[]>;
  isDarkTheme$: Observable<boolean>;
  channelUsers$: Observable<User[]>;
  newMessage = '';

  private destroy$ = new Subject<void>();

  constructor() {
    this.currentUser$ = this.store.select(ChatSelectors.selectCurrentUser);
    this.users$ = this.store.select(ChatSelectors.selectUsers);
    this.channels$ = this.store.select(ChatSelectors.selectChannels);
    this.selectedChannel$ = this.store.select(
      ChatSelectors.selectSelectedChannel
    );
    this.messages$ = this.store.select(
      ChatSelectors.selectCurrentChannelMessages
    );
    this.isDarkTheme$ = this.store.select(ChatSelectors.selectIsDarkTheme);
    this.channelUsers$ = this.store.select(ChatSelectors.selectChannelUsers);
  }

  ngOnInit(): void {
    this.store.dispatch(ChatActions.initApp());

    this.isDarkTheme$.pipe(takeUntil(this.destroy$)).subscribe((isDark) => {
      if (isDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage(message: string): void {
    if (message.trim()) {
      this.store.dispatch(ChatActions.sendMessage({ content: message }));
    }
  }

  toggleTheme(): void {
    this.store
      .select(ChatSelectors.selectIsDarkTheme)
      .pipe(take(1))
      .subscribe((isDark) => {
        this.store.dispatch(ChatActions.setTheme({ isDark: !isDark }));
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
      });
  }

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
