import { Injectable, signal } from '@angular/core';

export interface NotificationItem {
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications = signal<NotificationItem[]>([]);

  addNotification(message: string) {
    this.notifications.update((list) => [
      { message, timestamp: new Date() },
      ...list,
    ]);
  }
}
