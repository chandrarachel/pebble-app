import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ReminderCard from '../components/ReminderCard';

const { width: windowWidth } = Dimensions.get('window');

const CalendarScreen = ({ navigation }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 25)); // April 25, 2025
    const [selectedDate, setSelectedDate] = useState(25);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Animate when component mounts
    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);


    // Sample reminders data
    const [reminders, setReminders] = useState([]);

    const loadReminders = async () => {
        try {
            const reminders = await AsyncStorage.getItem('reminders');
            if (reminders !== null) {
                setReminders(JSON.parse(reminders));

            }
        } catch (error) {
            console.error('Error loading reminders:', error);
        }
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDate = firstDay.getDay();

        const days = [];

        // Add empty spaces for days before the first day of the month
        for (let i = 0; i < startDate; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        // Add empty spaces after the last day to fill the last week (so grid is always 7 columns wide)
        while (days.length % 7 !== 0) {
            days.push(null);
        }

        return days;
    };

    useFocusEffect(
        React.useCallback(() => {
            loadReminders();
        }, [])
    );

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const formatDate = (date) => {
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const hasReminder = (day) => {
        return reminders.some(reminder => new Date(reminder.time).getDate() === day);
    };

    const getRemindersForDate = (day) => {
        return reminders.filter(reminder => new Date(reminder.time).getDate() === day);
    };

    const renderCalendarDay = (day, index) => {
        if (!day) {
            return <View key={index} style={styles.emptyDay} />;
        }

        const isSelected = day === selectedDate;
        const isToday = day === 25; // Assuming today is 25th
        const hasReminderToday = hasReminder(day);

        return (
            <TouchableOpacity
                key={index}
                style={[
                    styles.dayContainer,
                    isSelected && styles.selectedDay,
                    isToday && !isSelected && styles.todayDay
                ]}
                onPress={() => setSelectedDate(day)}
            >
                <Text style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                    isToday && !isSelected && styles.todayDayText
                ]}>
                    {day}
                </Text>
                {hasReminderToday && (
                    <View style={styles.reminderDot} />
                )}
            </TouchableOpacity>
        );
    };

    const renderReminderItem = (reminder) => (
        <View key={reminder.text} style={styles.reminderItem}>
            <TouchableOpacity style={styles.checkbox}>
                {reminder.completed ? (
                    <MaterialIcons name="check-circle" size={24} color="#6EC6CA" />
                ) : (
                    <View style={styles.uncheckedBox} />
                )}
            </TouchableOpacity>

            <View style={styles.reminderContent}>
                <Text style={[styles.reminderTitle, reminder.completed && styles.completedText]}>
                    {reminder.text}
                </Text>
                <View style={styles.reminderMeta}>
                    <View style={styles.timeContainer}>
                        <MaterialIcons name="access-time" size={14} color="#6EC6CA" />
                        <Text style={styles.metaText}>{new Date(reminder.time).toLocaleTimeString()}</Text>
                    </View>
                    <View style={styles.locationContainer}>
                        <MaterialIcons name="location-on" size={14} color="#6EC6CA" />
                        <Text style={styles.metaText}>{reminder.location}</Text>
                    </View>
                </View>
                {reminder.tag && (
                    <View style={styles.tagContainer}>
                        <Text style={styles.tagText}>{reminder.tag}</Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Calendar</Text>
                <TouchableOpacity 
                    style={styles.todayButton}
                    onPress={() => {
                        const today = new Date();
                        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
                        setSelectedDate(today.getDate());
                    }}
                >
                    <Text style={styles.todayButtonText}>Today</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Calendar Widget */}
                <Animated.View style={[styles.calendarContainer, { opacity: fadeAnim }]}>
                    {/* Month Navigation */}
                    <View style={styles.monthHeader}>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigateMonth(-1)}
                        >
                            <MaterialIcons name="chevron-left" size={24} color="#5C8374" />
                        </TouchableOpacity>

                        <Text style={styles.monthText}>
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </Text>

                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigateMonth(1)}
                        >
                            <MaterialIcons name="chevron-right" size={24} color="#5C8374" />
                        </TouchableOpacity>
                    </View>

                    {/* Days of Week Header */}
                    <View style={styles.daysOfWeekContainer}>
                        {daysOfWeek.map((day, index) => (
                            <View key={index} style={styles.dayOfWeekContainer}>
                                <Text style={styles.dayOfWeekText}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Calendar Grid */}
                    <View style={styles.calendarGrid}>
                        {getDaysInMonth(currentDate).map((day, index) =>
                            renderCalendarDay(day, index)
                        )}
                    </View>
                </Animated.View>

                {/* Selected Date Section */}
                <Animated.View
                    style={[
                        styles.selectedDateSection,
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
                    <Text style={styles.selectedDateTitle}>
                        {formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate))}
                    </Text>

                    {getRemindersForDate(selectedDate).length > 0 ? (
                        <View style={styles.remindersContainer}>
                            {getRemindersForDate(selectedDate).map(renderReminderItem)}
                        </View>
                    ) : (
                        <View style={styles.noRemindersContainer}>
                            <MaterialIcons name="event-available" size={48} color="#E0E0E0" />
                            <Text style={styles.noRemindersText}>No reminders for this date</Text>
                            <TouchableOpacity
                                style={styles.addReminderButton}
                                onPress={() => navigation?.navigate('ChatCreate')}
                            >
                                <MaterialIcons name="add" size={20} color="#5C8374" />
                                <Text style={styles.addReminderText}>Add Reminder</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
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
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#F2F7F5',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#232D3F',
    },
    todayButton: {
        backgroundColor: '#6EC6CA',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    todayButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    calendarContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    navButton: {
        padding: 8,
    },
    monthText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#232D3F',
    },
    daysOfWeekContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    dayOfWeekContainer: {
        flex: 1,
        alignItems: 'center',
    },
    dayOfWeekText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    emptyDay: {
        flexBasis: '14.2857%',
        flexGrow: 1,
        flexShrink: 1,
        height: 40,
    },
    dayContainer: {
        flexBasis: '14.2857%',
        flexGrow: 1,
        flexShrink: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    selectedDay: {
        backgroundColor: '#6EC6CA',
        borderRadius: 20,
    },
    todayDay: {
        backgroundColor: '#E8F4F8',
        borderRadius: 20,
    },
    dayText: {
        fontSize: 16,
        color: '#232D3F',
        fontWeight: '500',
    },
    selectedDayText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    todayDayText: {
        color: '#5C8374',
        fontWeight: '600',
    },
    reminderDot: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#6EC6CA',
    },
    selectedDateSection: {
        paddingHorizontal: 20,
    },
    selectedDateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#232D3F',
        marginBottom: 16,
    },
    remindersContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    reminderItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
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
    reminderContent: {
        flex: 1,
    },
    reminderTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#232D3F',
        marginBottom: 8,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    reminderMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
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
    noRemindersContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    noRemindersText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
        marginBottom: 16,
    },
    addReminderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F4F8',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    addReminderText: {
        fontSize: 14,
        color: '#5C8374',
        fontWeight: '600',
        marginLeft: 6,
    },
    bottomPadding: {
        height: 40,
    },
});

export default CalendarScreen;
