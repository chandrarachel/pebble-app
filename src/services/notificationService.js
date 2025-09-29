import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const setupNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
};

export const registerForPushNotificationsAsync = async () => {
  if(Device.isDevice && Platform.OS !== 'web' ) {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  }
};

export const sendNotification = async (title, body, data) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { data: data },
      icon: require('../../assets/logo.png'),
    },
    trigger: null,
  });
}

export const scheduleNotification = async () => {
  const triggerTime = new Date(Date.now() + 10000); 
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Scheduled Notification",
      body: 'This is a test notification',
      data: { data: 'goes here' },
      icon: require('../../assets/logo.png'),
    },
    trigger: triggerTime,
  });
};

export const setupNotificationListeners = () => {
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification Received:', notification);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification Response:', response);
  });

  return {
    notificationListener,
    responseListener,
    cleanup: () => {
      notificationListener?.remove();
      responseListener?.remove();
    }
  };
};