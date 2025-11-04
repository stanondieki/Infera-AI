// Notification system for admin-user communication

export interface Notification {
  id: string;
  user_id: string;
  type: 'task_assigned' | 'task_updated' | 'payment_confirmed' | 'payment_pending' | 'message' | 'achievement' | 'milestone' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  icon: string;
  status?: 'success' | 'warning' | 'info' | 'error';
  data?: any;
}

const NOTIFICATIONS_KEY = 'inferaai_notifications';

export function getNotifications(userId: string): Notification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored) {
      const all = JSON.parse(stored);
      return all.filter((n: Notification) => n.user_id === userId);
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
  return [];
}

export function getAllNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
  return [];
}

export function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
  const all = getAllNotifications();
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };
  all.push(newNotification);
  saveNotifications(all);
}

export function markAsRead(notificationId: string): void {
  const all = getAllNotifications();
  const updated = all.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveNotifications(updated);
}

export function markAllAsRead(userId: string): void {
  const all = getAllNotifications();
  const updated = all.map(n => 
    n.user_id === userId ? { ...n, read: true } : n
  );
  saveNotifications(updated);
}

export function deleteNotification(notificationId: string): void {
  const all = getAllNotifications();
  const updated = all.filter(n => n.id !== notificationId);
  saveNotifications(updated);
}

export function getUnreadCount(userId: string): number {
  const notifications = getNotifications(userId);
  return notifications.filter(n => !n.read).length;
}

// Helper function for admin to send notifications
export function sendNotificationToUser(
  userId: string,
  type: Notification['type'],
  title: string,
  description: string,
  icon: string = 'bell',
  status?: Notification['status'],
  data?: any
): void {
  addNotification({
    user_id: userId,
    type,
    title,
    description,
    icon,
    status,
    data,
  });
}
