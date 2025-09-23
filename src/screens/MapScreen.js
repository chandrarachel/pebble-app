import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';


// Removed mockReminders. Will load from AsyncStorage.

const MapScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      // Load reminders from AsyncStorage
      try {
        const jsonValue = await AsyncStorage.getItem('reminders');
        const savedReminders = jsonValue != null ? JSON.parse(jsonValue) : [];
        setReminders(savedReminders);
      } catch (e) {
        console.error("Failed to fetch reminders from storage", e);
        setReminders([]);
      }
      setLoading(false);
    })();
  }, []);

  const getPebbleColor = (priority) => {
    switch (priority) {
      case 'high': return '#FFD166';
      case 'medium': return '#6EC6CA';
      default: return '#5C8374';
    }
  };

  if (loading || !region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6EC6CA" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {reminders.map((reminder, idx) => (
          <Marker
            key={reminder.id ? String(reminder.id) : `reminder-${idx}`}
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
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ChatCreate')}>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;