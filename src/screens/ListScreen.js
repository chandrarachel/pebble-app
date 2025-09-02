import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListScreen = () => {
  const [reminders] = useState([
    {
      id: '1',
      title: 'Buy groceries',
      description: 'Get milk, bread, and eggs',
      location: 'Whole Foods Market',
      priority: 'high',
      dueDate: '2024-01-15',
      completed: false
    },
    {
      id: '2',
      title: 'Pick up dry cleaning',
      description: 'Blue shirt and black pants',
      location: 'Clean Express',
      priority: 'medium',
      dueDate: '2024-01-16',
      completed: false
    },
    {
      id: '3',
      title: 'Meet Sarah for coffee',
      description: 'Catch up and discuss project',
      location: 'Starbucks Downtown',
      priority: 'low',
      dueDate: '2024-01-17',
      completed: true
    }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FFD166';
      case 'medium': return '#6EC6CA';
      default: return '#5C8374';
    }
  };

  const ReminderCard = ({ item }) => (
    <TouchableOpacity style={[styles.card, item.completed && styles.completedCard]}>
      <View style={styles.cardHeader}>
        <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
        <Text style={[styles.title, item.completed && styles.completedText]}>{item.title}</Text>
        <TouchableOpacity>
          <Icon name="more-vert" size={20} color="#232D3F" />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.description, item.completed && styles.completedText]}>
        {item.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={16} color="#6EC6CA" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <Text style={styles.dueDate}>{item.dueDate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reminders</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-list" size={24} color="#5C8374" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReminderCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#232D3F',
  },
  filterButton: {
    padding: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedCard: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#232D3F',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 12,
    color: '#6EC6CA',
    marginLeft: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default ListScreen;