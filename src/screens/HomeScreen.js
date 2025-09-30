import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Animated,
    Dimensions
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { formatLocalDateTime  } from '../utils/formatLocalDateTime';
import { registerForPushNotificationsAsync, setupNotificationListeners, sendNotification } from '../services/notificationService';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import backgroundLocationService from '../services/backgroundTask';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [reminders, setReminders] = useState([]);
    const [region, setRegion] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const getUserLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    }

    const getReminders = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('reminders');
            const loadedReminders = jsonValue != null ? JSON.parse(jsonValue) : [];
            
            const sortedReminders = loadedReminders.sort((a, b) => new Date(a.time) - new Date(b.time));
            
            setReminders(sortedReminders);
        } catch (e) {
            console.error("Failed to fetch reminders from storage", e);
        }
    };

    useFocusEffect(
        React.useCallback(async () => {
            await getReminders();
            await getUserLocation();
        }, [])
    );

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => console.log(token));

        const listeners = setupNotificationListeners();

        return () => {
            listeners.cleanup();
        };
    }, []);

    useEffect(() => {
        const initializeBackgroundLocation = async () => {
            try {
                const isTracking = await backgroundLocationService.isTrackingLocation();
                if (!isTracking) {
                    await backgroundLocationService.startBackgroundLocation();
                }
            } catch (error) {
                console.error('Failed to initialize background location:', error);
                // Show user-friendly error message
                alert('Location permission is required for location-based reminders to work properly.');
            }
        };

        initializeBackgroundLocation();
    }, []);

    const fetchUserLocation = async () => {
        try {
            // First try to get last known location from background service
            const lastKnown = await backgroundLocationService.getLastKnownLocation();
            if (lastKnown) {
                setRegion({
                    latitude: lastKnown.latitude,
                    longitude: lastKnown.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
                return;
            }

            // Fall back to requesting current location
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }
            
            const location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };



    // Handler for bell button press
    const handleBellPress = async () => {
        try {
            const reminder = reminders[0];
            if (reminder) {
                await sendNotification('Reminder', reminder.text, { id: reminder.id });
            }
            console.log('Notification scheduled from bell button');
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    };
    
    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const ReminderCard = ({ item, index }) => (
        <Animated.View
            style={[
                styles.reminderCard,
                {
                    opacity: fadeAnim,
                    transform: [{
                        translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                        }),
                    }]
                }
            ]}
        >
            <Ripple
                style={styles.reminderCardInner}
                rippleColor="#6EC6CA"
                rippleOpacity={0.2}
                rippleContainerBorderRadius={16}
            >
                <View style={styles.reminderHeader}>
                    <TouchableOpacity style={styles.checkbox}>
                        {item.completed ? (
                            <MaterialIcons name="check-circle" size={24} color="#6EC6CA" />
                        ) : (
                            <View style={styles.uncheckedBox} />
                        )}
                    </TouchableOpacity>
                    <View style={styles.reminderContent}>
                        <Text style={[
                            styles.reminderTitle,
                            item.completed && styles.completedText
                        ]}>
                            {item.text}
                        </Text>
                        <View style={styles.reminderMetaRow}>
                            <View style={styles.reminderMetaItem}>
                                <MaterialIcons name="access-time" size={16} color="#6EC6CA" style={{marginRight: 4}} />
                                <Text style={styles.metaText}>{formatLocalDateTime(item.time)}</Text>
                            </View>
                            <View style={styles.reminderMetaItem}>
                                <MaterialIcons name="location-on" size={16} color="#6EC6CA" style={{marginRight: 4}} />
                                <Text style={[styles.metaText, styles.locationText]} numberOfLines={1} ellipsizeMode="tail">{item.location || 'No location'}</Text>
                            </View>
                        </View>
                        {item.tag && (
                            <View style={styles.tagContainer}>
                                <Text style={styles.tagText}>{item.tag}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Ripple>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ripple
                        style={styles.avatar}
                        rippleColor="#5C8374"
                        rippleOpacity={0.3}
                        rippleContainerBorderRadius={25}
                    >
                        <Text style={styles.avatarText}>JD</Text>
                    </Ripple>
                </View>

                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Pebbles"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <TouchableOpacity style={styles.menuButton} onPress={handleBellPress}>
                    <Feather name="bell" size={24} color="#5C8374" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Map Section */}
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={region}
                        showsUserLocation={false}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                    >
                        <Marker
                            coordinate={{
                                latitude: 37.7749,
                                longitude: -122.4194,
                            }}
                        >
                            <View style={styles.pebbleMarker}>
                                <MaterialIcons name="location-on" size={20} color="#232D3F" />
                            </View>
                        </Marker>
                    </MapView>

                    <TouchableOpacity
                        style={styles.mapOverlay}
                        onPress={() => navigation?.navigate('Map')}
                    >
                        <View style={styles.mapOverlayContent} />
                    </TouchableOpacity>
                </View>

                {/* Upcoming Pebbles Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Upcoming Pebbles</Text>
                        <Ripple
                            style={styles.seeAllButton}
                            onPress={() => navigation?.navigate('Calendar')}
                            rippleColor="#5C8374"
                            rippleOpacity={0.3}
                            rippleContainerBorderRadius={12}
                        >
                            <Text style={styles.seeAllText}>See All</Text>
                        </Ripple>
                    </View>

                    {reminders.map((item, index) => (
                        <ReminderCard key={index} item={item} index={index} />
                    ))}
                </View>

                {/* Add some bottom padding */}
                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* Floating Action Button */}
            <View style={styles.fabContainer}>
                <Ripple
                    style={styles.fabButton}
                    onPress={() => navigation?.navigate('ChatCreate')}
                    rippleColor="#232D3F"
                    rippleOpacity={0.3}
                    rippleContainerBorderRadius={30}
                >
                    <MaterialIcons name="add" size={24} color="#232D3F" style={styles.fabIcon} />
                    <Text style={styles.fabText}>New Pebble</Text>
                </Ripple>
            </View>
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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#F2F7F5',
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#5C8374',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#232D3F',
    },
    menuButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    mapContainer: {
        height: 300,
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
    },
    map: {
        flex: 1,
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    mapOverlayContent: {
        flex: 1,
    },
    pebbleMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6EC6CA',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    section: {
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#232D3F',
    },
    seeAllButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#F2F7F5',
        borderWidth: 1,
        borderColor: '#5C8374',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5C8374',
    },
    reminderCard: {
        marginBottom: 12,
    },
    reminderCardInner: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    reminderHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        marginRight: 12,
        marginTop: 2,
    },
    uncheckedBox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    reminderMetaRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 8,
        marginBottom: 2,
        gap: 2,
    },
    reminderMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F7F5',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginBottom: 2,
        minWidth: 0,
        maxWidth: '100%',
    },
    metaText: {
        fontSize: 15,
        color: '#6C757D',
        marginLeft: 2,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    locationText: {
        fontWeight: '500',
        color: '#5C8374',
        maxWidth: 180,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    tagContainer: {
        alignSelf: 'flex-start',
    },
    tagText: {
        fontSize: 12,
        color: '#5C8374',
        backgroundColor: '#5C837420',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    fabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6EC6CA',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fabIcon: {
        marginRight: 8,
    },
    fabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#232D3F',
    },
    bottomPadding: {
        height: 100,
    },
});

export default HomeScreen;