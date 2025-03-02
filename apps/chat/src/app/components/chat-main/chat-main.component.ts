import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../interfaces/channel.interface';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'app-chat-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})
export class ChatMainComponent {
  @Input() selectedChannel: Channel | null = null;
  @Input() messages: Message[] | null = null;
  @Output() messageSend = new EventEmitter<string>();

  newMessage = '';

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messageSend.emit(this.newMessage);
      this.newMessage = '';
    }
  }
} 