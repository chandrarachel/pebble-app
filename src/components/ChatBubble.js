import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { colors, spacing, borderRadius, shadows, typography } from '../styles/globalStyles';

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
    marginBottom: spacing.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  userBubble: {
    backgroundColor: colors.pebble.green,
    borderBottomRightRadius: 6,
  },
  botBubble: {
    backgroundColor: colors.neutral.white,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  text: {
    ...typography.body1,
  },
  userText: {
    color: colors.pebble.mint,
    fontWeight: '500',
  },
  botText: {
    color: colors.pebble.slate,
  },
  actionsContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
  },
  actionHint: {
    ...typography.caption,
    color: colors.pebble.aqua,
    fontStyle: 'italic',
  },
});

export default ChatBubble;