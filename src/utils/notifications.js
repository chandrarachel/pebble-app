import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure() {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push notification token:', token);
      },
      
      onNotification: (notification) => {
        console.log('Notification received:', notification);
        if (notification.userInteraction) {
          // Handle notification tap
          this.handleNotificationTap(notification);
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channels for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'pebble-reminders',
          channelName: 'Pebble Reminders',
          channelDescription: 'Location-based reminders from Pebble',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Channel created: ${created}`)
      );
    }
  }

  scheduleLocationReminder(reminder) {
    const { id, title, description, latitude, longitude } = reminder;
    
    PushNotification.localNotification({
      id: id,
      channelId: 'pebble-reminders',
      title: '📍 Pebble Reminder',
      message: `${title} - You're near this location!`,
      bigText: description,
      subText: 'Location-based reminder',
      color: '#5C8374',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      actions: ['Mark Complete', 'Snooze'],
      userInfo: {
        type: 'location_reminder',
        reminderId: id,
        latitude,
        longitude
      }
    });
  }

  scheduleTimeReminder(reminder) {
    const { id, title, description, dueDate } = reminder;
    
    PushNotification.localNotificationSchedule({
      id: id,
      channelId: 'pebble-reminders',
      title: '⏰ Pebble Reminder',
      message: title,
      bigText: description,
      date: new Date(dueDate),
      color: '#FFD166',
      vibrate: true,
      playSound: true,
      actions: ['Mark Complete', 'Snooze 15min'],
      userInfo: {
        type: 'time_reminder',
        reminderId: id
      }
    });
  }

  cancelReminder(reminderId) {
    PushNotification.cancelLocalNotifications({ id: reminderId });
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
    return new Promise((resolve) => {
      PushNotification.requestPermissions().then(resolve);
    });
  }

  checkPermissions() {
    return new Promise((resolve) => {
      PushNotification.checkPermissions(resolve);
    });
  }
}

export default new NotificationService();