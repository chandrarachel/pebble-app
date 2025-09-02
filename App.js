import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MapScreen from './src/screens/MapScreen';
import ListScreen from './src/screens/ListScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Map') iconName = 'map';
              else if (route.name === 'List') iconName = 'list';
              else if (route.name === 'Profile') iconName = 'person';
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#5C8374',
            tabBarInactiveTintColor: '#232D3F',
            tabBarStyle: {
              backgroundColor: '#F2F7F5',
              borderTopWidth: 0,
              elevation: 8,
              shadowOpacity: 0.1,
              height: 60,
              paddingBottom: 8
            },
            headerShown: false
          })}
        >
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="List" component={ListScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}