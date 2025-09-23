import React, { useState, useEffect } from 'react';
import { formatLocalDateTime } from '../utils/formatLocalDateTime';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import PebbleButton from '../components/PebbleButton';
import { colors, globalStyles, spacing, borderRadius, shadows, typography } from '../styles/globalStyles';

const NewPebbleScreen = ({ navigation, route }) => {
    const prefilled = route?.params || {};

    const [reminderText, setReminderText] = useState(prefilled.text || '');
    const [timeEnabled, setTimeEnabled] = useState(!!prefilled.time);
    const [locationEnabled, setLocationEnabled] = useState(!!prefilled.location);
    const [notes, setNotes] = useState('');
    const [selectedTime, setSelectedTime] = useState(prefilled.time || new Date().toLocaleString());
    const [selectedLocation, setSelectedLocation] = useState(prefilled.location || 'Current Location');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required for location-based reminders.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = location.coords;
            setCurrentLocation({ latitude, longitude });
            setMapRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // Reverse geocode to get address
            const address = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (address.length > 0) {
                const addr = address[0];
                const locationName = `${addr.name || addr.street || 'Unknown'}, ${addr.city || ''}`;
                setSelectedLocation(locationName);
            }
        } catch (error) {
            console.error('Error getting location:', error);
        }
    };

    const handleCreatePebble = async () => {
        try {
            // TODO: Integrate with reminderService
            const reminderData = {
                title: reminderText,
                description: notes,
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
                address: selectedLocation,
                priority: 'MEDIUM',
                completed: false,
                dueDate: timeEnabled ? new Date().toISOString() : null,
            };

            console.log('Creating reminder:', reminderData);
            // await reminderService.createReminder(reminderData);

            navigation.goBack();
        } catch (error) {
            console.error('Error creating reminder:', error);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={globalStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="close" size={24} color={colors.pebble.slate} />
                </TouchableOpacity>
                <Text style={globalStyles.headerTitle}>Edit Pebble</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
                <View style={globalStyles.section}>
                    <TextInput
                        style={[globalStyles.input, styles.mainInput]}
                        value={reminderText}
                        onChangeText={setReminderText}
                        placeholder="What would you like to be reminded about?"
                        placeholderTextColor={colors.neutral.gray400}
                    />
                </View>

                <View style={globalStyles.section}>
                    <View style={globalStyles.rowBetween}>
                        <View style={globalStyles.row}>
                            <MaterialIcons
                                name="schedule"
                                size={20}
                                color={timeEnabled ? colors.pebble.aqua : colors.neutral.gray300}
                            />
                            <Text style={[styles.sectionLabel, { marginLeft: spacing.sm }]}>Date & Time</Text>
                        </View>
                        <Switch
                            value={timeEnabled}
                            onValueChange={setTimeEnabled}
                            trackColor={{ false: colors.neutral.gray200, true: colors.pebble.aqua }}
                            thumbColor={colors.neutral.white}
                        />
                    </View>

                    {timeEnabled && (
                        <TouchableOpacity style={[globalStyles.card, styles.optionCard]}>
                            <Text style={styles.optionText}>
                                                                {formatLocalDateTime(selectedTime)}
                            </Text>
                            <MaterialIcons name="chevron-right" size={20} color={colors.neutral.gray400} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={globalStyles.section}>
                    <View style={globalStyles.rowBetween}>
                        <View style={globalStyles.row}>
                            <MaterialIcons
                                name="location-on"
                                size={20}
                                color={locationEnabled ? colors.pebble.aqua : colors.neutral.gray300}
                            />
                            <Text style={[styles.sectionLabel, { marginLeft: spacing.sm }]}>Location</Text>
                        </View>
                        <Switch
                            value={locationEnabled}
                            onValueChange={setLocationEnabled}
                            trackColor={{ false: colors.neutral.gray200, true: colors.pebble.aqua }}
                            thumbColor={colors.neutral.white}
                        />
                    </View>

                    {locationEnabled && (
                        <>
                            <TouchableOpacity style={[globalStyles.card, styles.optionCard]}>
                                <View style={globalStyles.row}>
                                    <MaterialIcons name="my-location" size={16} color={colors.pebble.green} />
                                    <Text style={[styles.optionText, { marginLeft: spacing.sm }]}>{selectedLocation}</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={20} color={colors.neutral.gray400} />
                            </TouchableOpacity>

                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    region={mapRegion}
                                    showsUserLocation={true}
                                    showsMyLocationButton={true}
                                    onPress={(e) => {
                                        const { latitude, longitude } = e.nativeEvent.coordinate;
                                        setMapRegion({ ...mapRegion, latitude, longitude });
                                    }}
                                >
                                    <Marker coordinate={mapRegion}>
                                        <View style={styles.pebbleMarker}>
                                            <MaterialIcons name="location-on" size={20} color={colors.pebble.slate} />
                                        </View>
                                    </Marker>
                                </MapView>
                                <View style={styles.mapOverlay}>
                                    <Text style={styles.mapHint}>Tap to set reminder location</Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                <View style={globalStyles.section}>
                    <Text style={styles.sectionLabel}>Additional Notes</Text>
                    <TextInput
                        style={[globalStyles.input, styles.notesInput]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Add any additional details..."
                        placeholderTextColor={colors.neutral.gray400}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {(timeEnabled || locationEnabled) && (
                    <View style={[globalStyles.card, styles.summaryCard]}>
                        <Text style={styles.summaryTitle}>Reminder Summary</Text>
                        {timeEnabled && (
                            <Text style={styles.summaryItem}>⏰ {formatLocalDateTime(selectedTime)}</Text>
                        )}
                        {locationEnabled && (
                            <Text style={styles.summaryItem}>📍 When near {selectedLocation}</Text>
                        )}
                        {timeEnabled && locationEnabled && (
                            <Text style={styles.summaryNote}>You'll be notified at whichever happens first</Text>
                        )}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={{ position: 'absolute', left: 16, right: 0, bottom: 20, width: '92%'  }}>
                <PebbleButton
                    title="Create Pebble"
                    onPress={handleCreatePebble}
                    disabled={!reminderText.trim()}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainInput: {
        fontSize: 18,
        fontWeight: '500',
    },
    sectionLabel: {
        ...typography.h6,
        color: colors.pebble.slate,
    },
    optionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    optionText: {
        ...typography.body1,
        color: colors.pebble.slate,
        flex: 1,
    },
    mapContainer: {
        height: 200,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginTop: spacing.md,
        ...shadows.md,
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: spacing.md,
        left: spacing.md,
        right: spacing.md,
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        ...shadows.sm,
    },
    mapHint: {
        ...typography.caption,
        color: colors.pebble.green,
        textAlign: 'center',
    },
    pebbleMarker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.pebble.aqua,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.md,
    },
    notesInput: {
        height: 100,
        marginTop: spacing.md,
    },
    summaryCard: {
        backgroundColor: colors.pebble.mint,
        borderWidth: 1,
        borderColor: colors.pebble.aqua,
    },
    summaryTitle: {
        ...typography.h6,
        color: colors.pebble.slate,
        marginBottom: spacing.md,
    },
    summaryItem: {
        ...typography.body2,
        color: colors.pebble.green,
        marginBottom: spacing.sm,
    },
    summaryNote: {
        ...typography.caption,
        color: colors.neutral.gray500,
        fontStyle: 'italic',
        marginTop: spacing.sm,
    },
    createButtonContainer: {
        padding: spacing.xl,
        backgroundColor: colors.neutral.white,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray200,
    },
});

export default NewPebbleScreen;
