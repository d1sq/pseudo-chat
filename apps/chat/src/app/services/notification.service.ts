import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  success(message: string, duration = 3000): void {
    this.show({
      type: 'success',
      message,
      duration,
    });
  }

  error(message: string, duration = 5000): void {
    this.show({
      type: 'error',
      message,
      duration,
    });
  }

  info(message: string, duration = 3000): void {
    this.show({
      type: 'info',
      message,
      duration,
    });
  }

  warning(message: string, duration = 4000): void {
    this.show({
      type: 'warning',
      message,
      duration,
    });
  }

  private show(notification: Notification): void {
    this.notificationSubject.next(notification);
  }
}
