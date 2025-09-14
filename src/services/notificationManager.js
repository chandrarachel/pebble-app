import NotificationService from '../utils/notifications';

class NotificationManager {
  constructor() {
    this.activeReminders = new Map();
  }

  // Schedule a location-based reminder
  scheduleLocationReminder(reminder) {
    try {
      NotificationService.scheduleLocationReminder(reminder);
      this.activeReminders.set(reminder.id, {
        ...reminder,
        type: 'location',
        scheduledAt: new Date()
      });
      return { success: true, id: reminder.id };
    } catch (error) {
      console.error('Failed to schedule location reminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Schedule a time-based reminder
  scheduleTimeReminder(reminder) {
    try {
      NotificationService.scheduleTimeReminder(reminder);
      this.activeReminders.set(reminder.id, {
        ...reminder,
        type: 'time',
        scheduledAt: new Date()
      });
      return { success: true, id: reminder.id };
    } catch (error) {
      console.error('Failed to schedule time reminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancel a reminder
  cancelReminder(reminderId) {
    try {
      NotificationService.cancelReminder(reminderId);
      this.activeReminders.delete(reminderId);
      return { success: true };
    } catch (error) {
      console.error('Failed to cancel reminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all active reminders
  getActiveReminders() {
    return Array.from(this.activeReminders.values());
  }

  // Check notification permissions
  async checkPermissions() {
    try {
      return await NotificationService.checkPermissions();
    } catch (error) {
      console.error('Failed to check permissions:', error);
      return null;
    }
  }

  // Request notification permissions
  async requestPermissions() {
    try {
      return await NotificationService.requestPermissions();
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return null;
    }
  }

  // Create sample reminders for testing
  createSampleReminders() {
    const samples = [
      {
        id: 'sample-1',
        title: 'Buy groceries',
        description: 'Remember to buy milk, eggs, and bread',
        latitude: 37.7749,
        longitude: -122.4194
      },
      {
        id: 'sample-2',
        title: 'Meeting reminder',
        description: 'Team standup at 2 PM',
        dueDate: new Date(Date.now() + 10000) // 10 seconds from now
      }
    ];

    const results = [];
    samples.forEach(sample => {
      if (sample.latitude && sample.longitude) {
        results.push(this.scheduleLocationReminder(sample));
      } else if (sample.dueDate) {
        results.push(this.scheduleTimeReminder(sample));
      }
    });

    return results;
  }
}

export default new NotificationManager();