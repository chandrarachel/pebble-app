import { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard, 
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { parseReminderText } from '../utils/nlpParser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatLocalDateTime } from '../utils/formatLocalDateTime';

const ChatCreateScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const _saveDataToArray = async (value) => {
    try {
      const existingData = await AsyncStorage.getItem('reminders');
      let dataArray = existingData ? JSON.parse(existingData) : [];
      
      dataArray.push(value);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem('reminders', JSON.stringify(dataArray));
    } catch (e) {
      console.error("Failed to save data to array", e);
    }
  }

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setIsProcessing(true);
    Keyboard.dismiss();

    console.log("Calling GPT")
    // Simulate AI processing bruh
    const parsed = await parseReminderText(message);
    console.log(JSON.stringify(parsed))

    if ("error" in parsed) {
      // THe user doesn't chat about tasks
      setAiResult({
        text: parsed.error,
        time: "--",
        location: "--",
        priority: "--"
      });

    } else {
      setAiResult({
        text: parsed.title,
        time: parsed.timeInfo || "5:00 pm",
        location: parsed.locationInfo || "current location",
        priority: parsed.priority
      });
    }
    setIsProcessing(false);
    
    // Animate result
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleEdit = () => {
    navigation.navigate('NewPebble', { ...aiResult });
  };

  const handleConfirm = async () => {
    // TODO: Create reminder using reminderService
    await _saveDataToArray(aiResult);
    console.log('Creating reminder:', aiResult);
    navigation.navigate('HomeMain');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#232D3F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Pebble</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.aiBubble}>
            <Text style={styles.aiBubbleText}>
              Hi! I'm your Pebble assistant. Tell me what you'd like to be reminded about! 🪨
            </Text>
          </View>

          {message && (
            <View style={styles.userBubble}>
              <Text style={styles.userBubbleText}>{message}</Text>
            </View>
          )}

          {isProcessing && (
            <View style={styles.processingBubble}>
              <Text style={styles.processingText}>Understanding your request...</Text>
            </View>
          )}

          {!!aiResult && (
            <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
              <Text style={styles.summaryTitle}>Here's what I understood:</Text>
              
              <View style={styles.summaryItem}>
                <MaterialIcons name="task-alt" size={18} color="#5C8374" />
                <Text style={styles.summaryText}>{aiResult.text}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <MaterialIcons name="access-time" size={18} color="#5C8374" />
                <Text style={styles.summaryText}>{formatLocalDateTime(aiResult.time)}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <MaterialIcons name="location-on" size={18} color="#5C8374" />
                <Text style={styles.summaryText}>{aiResult.location}</Text>
              </View>

              <View style={styles.summaryActions}>
                <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
                  <MaterialIcons name="edit" size={16} color="#5C8374" />
                  <Text style={styles.editBtnText}>Edit Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                  <MaterialIcons name="check-circle" size={16} color="#fff" />
                  <Text style={styles.confirmBtnText}>Create Pebble</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%' }}
      >
        <View style={[styles.inputContainer, { paddingBottom: 20, marginBottom: 0 }]}> 
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Remind me to buy groceries at 5pm..."
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend}
              editable={!aiResult && !isProcessing}
              returnKeyType="send"
              multiline
            />
            <TouchableOpacity 
              style={[
                styles.sendBtn,
                (!message.trim() || !!aiResult || isProcessing) && styles.sendBtnDisabled
              ]} 
              onPress={handleSend} 
              disabled={!message.trim() || !!aiResult || isProcessing}
            >
              <MaterialIcons
                name="send" 
                size={20} 
                color={message.trim() && !aiResult && !isProcessing ? "#F2F7F5" : "#999"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F7F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#F2F7F5',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#232D3F' },
  content: { flex: 1, padding: 20 },
  aiBubble: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignSelf: 'flex-start',
    maxWidth: '85%', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
  },
  aiBubbleText: { fontSize: 16, color: '#232D3F', lineHeight: 22 },
  userBubble: {
    backgroundColor: '#5C8374', borderRadius: 16, padding: 16, alignSelf: 'flex-end',
    maxWidth: '85%', marginBottom: 16,
  },
  userBubbleText: { fontSize: 16, color: '#F2F7F5', lineHeight: 22 },
  processingBubble: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignSelf: 'flex-start',
    marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
  },
  processingText: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginTop: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15,
    shadowRadius: 6, elevation: 5,
  },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: '#5C8374', marginBottom: 12 },
  summaryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  summaryText: { fontSize: 15, color: '#232D3F', marginLeft: 10, flex: 1 },
  summaryActions: {
    flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16,
    paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E0E0E0',
  },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    paddingHorizontal: 12, marginRight: 12,
  },
  editBtnText: { color: '#5C8374', fontWeight: '500', fontSize: 14, marginLeft: 6 },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#5C8374',
    borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16,
  },
  confirmBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14, marginLeft: 6 },
  inputContainer: {
    padding: 18, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E0E0',
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#F2F7F5',
    borderRadius: 25, paddingHorizontal: 16, paddingVertical: 8,
  },
  input: { flex: 1, fontSize: 16, color: '#232D3F', maxHeight: 80, paddingVertical: 8 },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#6EC6CA',
    justifyContent: 'center', alignItems: 'center', marginLeft: 8,
  },
  sendBtnDisabled: { backgroundColor: '#E0E0E0' },
});

export default ChatCreateScreen;