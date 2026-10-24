import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';
import type { ConversationMessage } from '../store/appStore';

interface ChatBubbleProps {
  message: ConversationMessage;
  isLatest: boolean;
}

/** Formats a unix-ms timestamp into a short time string like "2:30 PM". */
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/** Three bouncing dots shown while the assistant is "typing". */
const TypingIndicator: React.FC = () => {
  const dots = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const animations = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(dot, {
            toValue: -6,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [dots]);

  return (
    <View style={styles.typingContainer}>
      {dots.map((dot, index) => (
        <Animated.View
          key={`typing-dot-${index}`}
          style={[
            styles.typingDot,
            { transform: [{ translateY: dot }] },
          ]}
        />
      ))}
    </View>
  );
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLatest }) => {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isUser = message.role === 'user';
  const showTyping = isLatest && !isUser && message.content === '';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        isUser ? styles.wrapperUser : styles.wrapperAssistant,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>V</Text>
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
        ]}
      >
        {showTyping ? (
          <TypingIndicator />
        ) : (
          <Text style={styles.messageText}>{message.content}</Text>
        )}
      </View>

      {/* Timestamp positioned below the bubble */}
      <Text
        style={[
          styles.timestamp,
          isUser ? styles.timestampUser : styles.timestampAssistant,
        ]}
      >
        {formatTime(message.timestamp)}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    maxWidth: '80%',
  },
  wrapperUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  wrapperAssistant: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
    marginTop: 2,
  },
  avatarText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    maxWidth: '100%',
  },
  bubbleUser: {
    backgroundColor: 'rgba(108, 99, 255, 0.25)',
    borderRadius: 18,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  bubbleAssistant: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 18,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
  messageText: {
    color: colors.text,
    fontSize: typography.sizes.body,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  timestampUser: {
    textAlign: 'right',
  },
  timestampAssistant: {
    textAlign: 'left',
    marginLeft: 36, // avatar width + margin
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.textSecondary,
  },
});

export default ChatBubble;
