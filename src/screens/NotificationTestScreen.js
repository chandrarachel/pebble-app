import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NotificationManager from '../services/notificationManager';

const NotificationTestScreen = ({ navigation }) => {
  const [permissionStatus, setPermissionStatus] = useState(null);

  const checkPermissions = async () => {
    const permissions = await NotificationManager.checkPermissions();
    setPermissionStatus(permissions);
    Alert.alert('Permissions', JSON.stringify(permissions, null, 2));
  };

  const testLocationNotification = () => {
    const testReminder = {
      id: Date.now().toString(),
      title: 'Test Location Reminder',
      description: 'This is a test location-based reminder from Pebble!',
      latitude: 37.7749,
      longitude: -122.4194
    };
    
    const result = NotificationManager.scheduleLocationReminder(testReminder);
    Alert.alert(
      result.success ? 'Success' : 'Error',
      result.success ? 'Location notification sent!' : result.error
    );
  };

  const testTimeNotification = () => {
    const testReminder = {
      id: Date.now().toString(),
      title: 'Test Time Reminder',
      description: 'This is a test time-based reminder from Pebble!',
      dueDate: new Date(Date.now() + 5000) // 5 seconds from now
    };
    
    const result = NotificationManager.scheduleTimeReminder(testReminder);
    Alert.alert(
      result.success ? 'Success' : 'Error',
      result.success ? 'Time notification scheduled for 5 seconds!' : result.error
    );
  };

  const testInstantNotification = () => {
    const testReminder = {
      id: Date.now().toString(),
      title: 'Instant Test',
      description: 'Testing instant notification!',
      latitude: 0,
      longitude: 0
    };
    
    const result = NotificationManager.scheduleLocationReminder(testReminder);
    Alert.alert(
      result.success ? 'Success' : 'Error',
      result.success ? 'Instant notification sent!' : result.error
    );
  };

  const testSampleReminders = () => {
    const results = NotificationManager.createSampleReminders();
    const successCount = results.filter(r => r.success).length;
    Alert.alert('Sample Reminders', `Created ${successCount} sample reminders`);
  };

  const showActiveReminders = () => {
    const active = NotificationManager.getActiveReminders();
    Alert.alert('Active Reminders', `You have ${active.length} active reminders`);
  };

  const TestButton = ({ title, onPress, icon, color = '#5C8374' }) => (
    <TouchableOpacity style={[styles.testButton, { borderColor: color }]} onPress={onPress}>
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#232D3F" />
        </TouchableOpacity>
        <Text style={styles.title}>Notification Test</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Test push notification functionality</Text>
        
        <TestButton
          title="Check Permissions"
          icon="security"
          onPress={checkPermissions}
          color="#6EC6CA"
        />
        
        <TestButton
          title="Test Location Notification"
          icon="location-on"
          onPress={testLocationNotification}
        />
        
        <TestButton
          title="Test Time Notification (5s)"
          icon="schedule"
          onPress={testTimeNotification}
          color="#FFD166"
        />
        
        <TestButton
          title="Test Instant Notification"
          icon="notifications-active"
          onPress={testInstantNotification}
          color="#FF6B6B"
        />
        
        <TestButton
          title="Create Sample Reminders"
          icon="auto-awesome"
          onPress={testSampleReminders}
          color="#9C27B0"
        />
        
        <TestButton
          title="Show Active Reminders"
          icon="list"
          onPress={showActiveReminders}
          color="#FF9800"
        />

        {permissionStatus && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Permission Status:</Text>
            <Text style={styles.statusText}>
              Alert: {permissionStatus.alert ? '✅' : '❌'}
            </Text>
            <Text style={styles.statusText}>
              Badge: {permissionStatus.badge ? '✅' : '❌'}
            </Text>
            <Text style={styles.statusText}>
              Sound: {permissionStatus.sound ? '✅' : '❌'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F7F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232D3F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232D3F',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
});

export default NotificationTestScreen;