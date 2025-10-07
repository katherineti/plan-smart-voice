export type EventType = 'event' | 'task' | 'birthday';

export type NotificationType = 'push' | 'voice' | 'sms';

export interface EventNotification {
  type: NotificationType;
  minutesBefore: number;
}

export interface CalendarEvent {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  color: string;
  notifications: EventNotification[];
  repeatPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  customRepeat?: {
    frequency: number;
    unit: 'days' | 'weeks' | 'months';
  };
  userId: string;
}
