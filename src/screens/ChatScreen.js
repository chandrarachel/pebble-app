import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ripple from 'react-native-material-ripple';
import { MaterialIcons } from '@expo/vector-icons';
import { parseReminderText, generateBotResponse } from '../utils/nlpParser';
import ChatBubble from '../components/ChatBubble';
import { colors, globalStyles, spacing, borderRadius, shadows } from '../styles/globalStyles';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm your Pebble assistant. Tell me what you'd like to be reminded about and where! 🪨",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Parse the input using NLP
    const parsedData = parseReminderText(input);
    
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(parsedData),
        sender: 'bot',
        timestamp: new Date(),
        parsedData // Store for potential reminder creation
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
    
    setInput('');
  };

  const handleCreateReminder = (parsedData) => {
    // TODO: Integrate with reminderService to create actual reminder
    console.log('Creating reminder:', parsedData);
  };

  const renderMessage = ({ item }) => (
    <ChatBubble
      message={item}
      isUser={item.sender === 'user'}
      onPress={item.parsedData ? () => handleCreateReminder(item.parsedData) : null}
      showActions={!!item.parsedData}
    />
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
        
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Remind me to..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
            />
            <Ripple
              style={[
                styles.sendButton,
                !input.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={!input.trim()}
              rippleColor="#F2F7F5"
              rippleContainerBorderRadius={20}
            >
              <MaterialIcons 
                name="send" 
                size={20} 
                color={input.trim() ? '#F2F7F5' : '#999'} 
              />
            </Ripple>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messagesList: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  inputContainer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.pebble.mint,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.pebble.slate,
    maxHeight: 100,
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.pebble.aqua,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral.gray200,
  },
});

export default ChatScreen;