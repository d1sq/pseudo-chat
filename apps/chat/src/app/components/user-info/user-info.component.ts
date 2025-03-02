import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  @Input() currentUser: User | null = null;
  @Input() isDarkTheme: boolean | null = false;

  @Output() themeToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() profileNavigate = new EventEmitter<void>();
} 