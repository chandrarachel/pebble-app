import { Alert, Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.scheduledNotifications = new Map();
    this.configure();
  }

  configure() {
    console.log('Notification service configured for Expo Go');
  }

  scheduleLocationReminder(reminder) {
    const { id, title } = reminder;
    
    // Simulate immediate location notification
    setTimeout(() => {
      Alert.alert(
        '📍 Pebble Reminder',
        `${title} - You're near this location!`,
        [{ text: 'OK', style: 'default' }]
      );
    }, 1000);
    
    this.scheduledNotifications.set(id, {
      type: 'location',
      title,
      scheduledAt: new Date()
    });
  }

  scheduleTimeReminder(reminder) {
    const { id, title, dueDate } = reminder;
    
    const delay = new Date(dueDate).getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(() => {
        Alert.alert(
          '⏰ Pebble Reminder',
          title,
          [{ text: 'OK', style: 'default' }]
        );
      }, delay);
    }
    
    this.scheduledNotifications.set(id, {
      type: 'time',
      title,
      dueDate,
      scheduledAt: new Date()
    });
  }

  cancelReminder(reminderId) {
    this.scheduledNotifications.delete(reminderId);
  }

  handleNotificationTap(notification) {
    const { userInfo } = notification;
    
    if (userInfo?.type === 'location_reminder') {
      // Navigate to map with reminder location
      console.log('Navigate to location reminder:', userInfo.reminderId);
    } else if (userInfo?.type === 'time_reminder') {
      // Navigate to reminder details
      console.log('Navigate to time reminder:', userInfo.reminderId);
    }
  }

  requestPermissions() {
    return Promise.resolve({ granted: true });
  }

  checkPermissions() {
    return Promise.resolve({
      alert: true,
      badge: true,
      sound: true,
    });
  }

  getScheduledNotifications() {
    return Array.from(this.scheduledNotifications.values());
  }
}

export default new NotificationService();