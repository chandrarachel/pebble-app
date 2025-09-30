import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../utils/notifications';

const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];
    
    console.log('Background location update:', location.coords);
    
    storeLocationUpdate(location);
    
    checkNearbyReminders(location.coords);
  }
});

const storeLocationUpdate = async (location) => {
  try {
    const locationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date().toISOString(),
    };
    
    // Store latest location
    await AsyncStorage.setItem('lastKnownLocation', JSON.stringify(locationData));
    
    // Store location history (keep last 10 updates)
    const historyJson = await AsyncStorage.getItem('locationHistory');
    let history = historyJson ? JSON.parse(historyJson) : [];
    
    history.unshift(locationData);
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    await AsyncStorage.setItem('locationHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error storing location:', error);
  }
};

const checkNearbyReminders = async (currentLocation) => {
  try {
    // Get reminders from AsyncStorage
    const remindersJson = await AsyncStorage.getItem('reminders');
    const reminders = remindersJson ? JSON.parse(remindersJson) : [];
    
    // Check each reminder for proximity
    for (const reminder of reminders) {
      if (reminder.latitude && reminder.longitude && !reminder.completed) {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          reminder.latitude,
          reminder.longitude
        );
        
        // If within 100 meters (0.1 km) and not already notified
        if (distance < 0.1 && !reminder.notified) {
          // Send notification
          notificationService.scheduleLocationReminder(reminder);
          
          // Mark as notified to prevent spam
          reminder.notified = true;
          await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
        }
      }
    }
  } catch (error) {
    console.error('Error checking nearby reminders:', error);
  }
};

// Calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const backgroundLocationService = {
  async startBackgroundLocation() {
    try {
      // Request permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        throw new Error('Foreground location permission not granted');
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        throw new Error('Background location permission not granted');
      }

      // Start background location updates
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5 * 60 * 1000, // 5 minutes
        distanceInterval: 50, // Update if moved 50 meters
        foregroundService: {
          notificationTitle: 'Pebble Location',
          notificationBody: 'Pebble is tracking your location for reminders',
          notificationColor: '#5C8374',
        },
      });

      console.log('Background location tracking started');
    } catch (error) {
      console.error('Failed to start background location:', error);
      throw error;
    }
  },

  async stopBackgroundLocation() {
    try {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      console.log('Background location tracking stopped');
    } catch (error) {
      console.error('Failed to stop background location:', error);
    }
  },

  async isTrackingLocation() {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
    return isRegistered;
  },

  async getLastKnownLocation() {
    try {
      const locationJson = await AsyncStorage.getItem('lastKnownLocation');
      return locationJson ? JSON.parse(locationJson) : null;
    } catch (error) {
      console.error('Error getting last known location:', error);
      return null;
    }
  },

  async getLocationHistory() {
    try {
      const historyJson = await AsyncStorage.getItem('locationHistory');
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting location history:', error);
      return [];
    }
  }
};

export default backgroundLocationService;