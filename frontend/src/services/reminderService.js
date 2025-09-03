import { generateClient } from 'aws-amplify/api';
import { createReminder, updateReminder, deleteReminder } from '../graphql/mutations';
import { listReminders, getReminder } from '../graphql/queries';
import { onCreateReminder, onUpdateReminder, onDeleteReminder } from '../graphql/subscriptions';

const client = generateClient();

export const reminderService = {
  // Create a new reminder
  async createReminder(reminderData) {
    try {
      const result = await client.graphql({
        query: createReminder,
        variables: { input: reminderData }
      });
      return result.data.createReminder;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  },

  // Get all reminders for the current user
  async getUserReminders(userId) {
    try {
      const result = await client.graphql({
        query: listReminders,
        variables: {
          filter: { ownerId: { eq: userId } }
        }
      });
      return result.data.listReminders.items;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }
  },

  // Update a reminder
  async updateReminder(id, updates) {
    try {
      const result = await client.graphql({
        query: updateReminder,
        variables: {
          input: { id, ...updates }
        }
      });
      return result.data.updateReminder;
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  },

  // Delete a reminder
  async deleteReminder(id) {
    try {
      const result = await client.graphql({
        query: deleteReminder,
        variables: { input: { id } }
      });
      return result.data.deleteReminder;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  },

  // Get reminders within a geographic area
  async getRemindersInArea(bounds) {
    try {
      const { northEast, southWest } = bounds;
      const result = await client.graphql({
        query: listReminders,
        variables: {
          filter: {
            and: [
              { latitude: { between: [southWest.latitude, northEast.latitude] } },
              { longitude: { between: [southWest.longitude, northEast.longitude] } }
            ]
          }
        }
      });
      return result.data.listReminders.items;
    } catch (error) {
      console.error('Error fetching area reminders:', error);
      throw error;
    }
  },

  // Subscribe to reminder changes
  subscribeToReminders(callback) {
    const subscription = client.graphql({
      query: onCreateReminder
    }).subscribe({
      next: ({ data }) => callback('create', data.onCreateReminder),
      error: (err) => console.error('Subscription error:', err)
    });

    return subscription;
  }
};

export default reminderService;