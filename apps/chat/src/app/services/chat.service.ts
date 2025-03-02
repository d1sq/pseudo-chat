import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Channel, Message } from '../interfaces/chat.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private currentUser: User = {
    id: '1',
    username: 'admin',
    isOnline: true
  };

  private users: User[] = [
    this.currentUser,
    { id: '2', username: 'Maria', isOnline: true },
    { id: '3', username: 'Max', isOnline: true },
    { id: '4', username: 'Andrew', isOnline: false }
  ];

  private channels: Channel[] = [
    { id: '1', name: 'general' },
    { id: '2', name: 'summer' },
    { id: '3', name: 'party' }
  ];

  private messages: Message[] = [
    {
      id: '1',
      fromUser: this.users[1],
      channelId: '1',
      content: 'hey\nhow are you?',
      timestamp: new Date('2024-03-20T10:00:00')
    },
    {
      id: '2',
      fromUser: this.users[2],
      channelId: '1',
      content: "hi, i'm work :(",
      timestamp: new Date('2024-03-20T10:01:00')
    }
  ];

  private selectedChannelSubject = new BehaviorSubject<Channel>(this.channels[0]);
  private messagesSubject = new BehaviorSubject<Message[]>(this.getChannelMessages(this.channels[0].id));

  getCurrentUser(): User {
    return this.currentUser;
  }

  getUsers(): User[] {
    return this.users;
  }

  getChannels(): Channel[] {
    return this.channels;
  }

  getSelectedChannel(): Observable<Channel> {
    return this.selectedChannelSubject.asObservable();
  }

  getMessages(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }

  selectChannel(channelId: string): void {
    const channel = this.channels.find(c => c.id === channelId);
    if (channel) {
      this.selectedChannelSubject.next(channel);
      this.messagesSubject.next(this.getChannelMessages(channelId));
    }
  }

  sendMessage(content: string): void {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      fromUser: this.currentUser,
      channelId: this.selectedChannelSubject.value.id,
      content: content,
      timestamp: new Date()
    };

    this.messages.push(newMessage);
    this.messagesSubject.next(this.getChannelMessages(this.selectedChannelSubject.value.id));
  }

  getChannelMessages(channelId: string): Message[] {
    return this.messages
      .filter(message => message.channelId === channelId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  addMessage(message: Message): void {
    this.messages.push(message);
  }
} 