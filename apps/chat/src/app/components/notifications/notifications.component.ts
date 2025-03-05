import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NotificationService,
  Notification,
} from '../../services/notification.service';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

interface ActiveNotification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  state: 'visible' | 'hidden';
  timeout?: ReturnType<typeof setTimeout>;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      @for (notification of activeNotifications; track notification.id) {
      <div
        class="notification"
        [ngClass]="'notification-' + notification.type"
        [@notificationAnimation]="notification.state"
      >
        <div class="notification-icon">
          @if (notification.type === 'success') {
          <span>✓</span>
          } @else if (notification.type === 'error') {
          <span>✗</span>
          } @else if (notification.type === 'info') {
          <span>ℹ</span>
          } @else if (notification.type === 'warning') {
          <span>⚠</span>
          }
        </div>
        <div class="notification-content">
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <button
          class="notification-close"
          (click)="removeNotification(notification.id)"
        >
          ×
        </button>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .notifications-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
      }

      .notification {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        color: var(--text-primary);
        background-color: var(--bg-primary);
        border-left: 4px solid;
      }

      .notification-success {
        border-left-color: var(--success-color);
      }

      .notification-error {
        border-left-color: var(--error-color);
      }

      .notification-info {
        border-left-color: var(--accent-color);
      }

      .notification-warning {
        border-left-color: #f39c12;
      }

      .notification-icon {
        margin-right: 12px;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .notification-success .notification-icon {
        color: var(--success-color);
      }

      .notification-error .notification-icon {
        color: var(--error-color);
      }

      .notification-info .notification-icon {
        color: var(--accent-color);
      }

      .notification-warning .notification-icon {
        color: #f39c12;
      }

      .notification-content {
        flex: 1;
      }

      .notification-message {
        font-size: 14px;
      }

      .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        transition: background-color 0.2s;
      }

      .notification-close:hover {
        background-color: var(--hover-bg);
      }
    `,
  ],
  animations: [
    trigger('notificationAnimation', [
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateX(100%)',
        })
      ),
      transition('hidden => visible', [animate('300ms ease-out')]),
      transition('visible => hidden', [animate('200ms ease-in')]),
    ]),
  ],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  activeNotifications: ActiveNotification[] = [];

  private subscription: Subscription = new Subscription();
  private counter = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.notifications$.subscribe((notification) => {
        this.addNotification(notification);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.activeNotifications.forEach((notification) => {
      if (notification.timeout) {
        clearTimeout(notification.timeout);
      }
    });
  }

  addNotification(notification: Notification): void {
    const id = this.counter++;

    const newNotification: ActiveNotification = {
      id,
      type: notification.type,
      message: notification.message,
      state: 'visible',
    };

    this.activeNotifications.push(newNotification);

    if (notification.duration !== 0) {
      newNotification.timeout = setTimeout(() => {
        this.hideNotification(id);
      }, notification.duration || 3000);
    }
  }

  hideNotification(id: number): void {
    const notification = this.activeNotifications.find((n) => n.id === id);
    if (notification) {
      notification.state = 'hidden';

      setTimeout(() => {
        this.removeNotification(id);
      }, 200);
    }
  }

  removeNotification(id: number): void {
    const index = this.activeNotifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      const notification = this.activeNotifications[index];
      if (notification.timeout) {
        clearTimeout(notification.timeout);
      }
      this.activeNotifications.splice(index, 1);
    }
  }
}
