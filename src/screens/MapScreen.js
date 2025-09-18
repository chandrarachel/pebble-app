import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

const MapScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mockReminders = [
    {
      id: '1',
      title: 'Buy groceries',
      latitude: 37.78825,
      longitude: -122.4324,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Pick up dry cleaning',
      latitude: 37.79025,
      longitude: -122.4344,
      priority: 'medium'
    }
  ];

  useEffect(() => {
    setReminders(mockReminders);
  }, []);

  const getPebbleColor = (priority) => {
    switch (priority) {
      case 'high': return '#FFD166';
      case 'medium': return '#6EC6CA';
      default: return '#5C8374';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {reminders.map((reminder) => (
          <Marker
            key={reminder.id}
            coordinate={{
              latitude: reminder.latitude,
              longitude: reminder.longitude,
            }}
            title={reminder.title}
          >
            <View style={[styles.pebblePin, { backgroundColor: getPebbleColor(reminder.priority) }]}>
              <MaterialIcons name="place" size={20} color="#232D3F" />
            </View>
          </Marker>
        ))}
      </MapView>
      
      <TouchableOpacity style={styles.addButton}>
        <MaterialIcons name="add" size={24} color="#F2F7F5" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  pebblePin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5C8374',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MapScreen;