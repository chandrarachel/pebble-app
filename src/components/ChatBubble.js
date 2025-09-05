import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ripple from 'react-native-material-ripple';

const ChatBubble = ({ 
  message, 
  isUser = false, 
  onPress = null,
  showActions = false 
}) => {
  const BubbleComponent = onPress ? Ripple : View;
  const bubbleProps = onPress ? {
    onPress,
    rippleColor: isUser ? '#F2F7F5' : '#6EC6CA',
    rippleOpacity: 0.3,
    rippleContainerBorderRadius: 20
  } : {};

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.botContainer
    ]}>
      <BubbleComponent
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble
        ]}
        {...bubbleProps}
      >
        <Text style={[
          styles.text,
          isUser ? styles.userText : styles.botText
        ]}>
          {message.text}
        </Text>
        
        {showActions && message.parsedData && (
          <View style={styles.actionsContainer}>
            <Text style={styles.actionHint}>
              Tap to create reminder
            </Text>
          </View>
        )}
      </BubbleComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#5C8374',
    borderBottomRightRadius: 6,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#F2F7F5',
    fontWeight: '500',
  },
  botText: {
    color: '#232D3F',
  },
  actionsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionHint: {
    fontSize: 12,
    color: '#6EC6CA',
    fontStyle: 'italic',
  },
});

export default ChatBubble;