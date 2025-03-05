import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/chat.interface';
import { UsersListComponent } from '../users-list/users-list.component';
import { ChannelsListComponent } from '../channels-list/channels-list.component';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    UsersListComponent,
    ChannelsListComponent,
    UserInfoComponent,
  ],
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss'],
})
export class ChatSidebarComponent {
  @Input() currentUser: User | null = null;
  @Input() isDarkTheme: boolean | null = false;
  @Input() users: User[] | null = [];
  @Input() channelUsers: User[] | null = [];

  @Output() themeToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() profileNavigate = new EventEmitter<void>();
}
