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
import { ChatService } from '../../services/chat.service';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ChatMainComponent } from '../../components/chat-main/chat-main.component';
import { ChatSidebarComponent } from '../../components/chat-sidebar/chat-sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChatMainComponent,
    ChatSidebarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store<AppState>);
  private chatService = inject(ChatService);
  
  currentUser$: Observable<User | null>;
  users$: Observable<User[]>;
  channels$: Observable<Channel[]>;
  selectedChannel$: Observable<Channel | null>;
  messages$: Observable<Message[]>;
  isDarkTheme$: Observable<boolean>;
  newMessage = '';
  
  private destroy$ = new Subject<void>();
  
  constructor() {
    this.currentUser$ = this.store.select(ChatSelectors.selectCurrentUser);
    this.users$ = this.store.select(ChatSelectors.selectUsers);
    this.channels$ = this.store.select(ChatSelectors.selectChannels);
    this.selectedChannel$ = this.store.select(ChatSelectors.selectSelectedChannel);
    this.messages$ = this.store.select(ChatSelectors.selectCurrentChannelMessages);
    this.isDarkTheme$ = this.store.select(ChatSelectors.selectIsDarkTheme);
  }
  
  ngOnInit(): void {
    // Устанавливаем текущего пользователя
    const currentUser = this.chatService.getCurrentUser();
    this.store.dispatch(ChatActions.setCurrentUser({ user: currentUser }));
    
    // Загружаем начальные данные
    this.store.dispatch(ChatActions.loadUsers());
    this.store.dispatch(ChatActions.loadChannels());
    
    // Выбираем начальный канал
    const initialChannel = this.chatService.getChannels()[0];
    if (initialChannel) {
      this.store.dispatch(ChatActions.selectChannel({ channelId: initialChannel.id }));
      this.store.dispatch(ChatActions.loadMessages({ channelId: initialChannel.id }));
    }
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    this.store.dispatch(ChatActions.setTheme({ isDark: savedTheme === 'dark' }));
    
    // Подписываемся на изменения темы
    this.isDarkTheme$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isDark => {
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
  
  selectChannel(channelId: string): void {
    this.store.dispatch(ChatActions.selectChannel({ channelId }));
    this.store.dispatch(ChatActions.loadMessages({ channelId }));
  }
  
  sendMessage(message: string): void {
    if (this.selectedChannel$ && message.trim()) {
      // Здесь будет логика отправки сообщения
      console.log('Sending message:', message);
    }
  }

  toggleTheme(): void {
    this.store.select(ChatSelectors.selectIsDarkTheme).pipe(
      take(1)
    ).subscribe(isDark => {
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