import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView 
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { parseReminderText, generateBotResponse } from '../utils/nlpParser';
import ChatBubble from '../components/ChatBubble';

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
    <SafeAreaView style={styles.container}>
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
              <Icon 
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
  container: {
    flex: 1,
    backgroundColor: '#F2F7F5',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F2F7F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#232D3F',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6EC6CA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});

export default ChatScreen;