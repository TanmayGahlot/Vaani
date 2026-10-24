import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface QuickActionsProps {
  onActionPress: (action: string) => void;
}

const ACTIONS: QuickAction[] = [
  { id: 'translate', label: 'Translate', icon: '🌐', color: '#6C63FF' },
  { id: 'call', label: 'Make Call', icon: '📞', color: '#4CAF50' },
  { id: 'message', label: 'Send Message', icon: '💬', color: '#00D9FF' },
  { id: 'alarm', label: 'Set Alarm', icon: '⏰', color: '#FF9800' },
  { id: 'app', label: 'Open App', icon: '📱', color: '#E91E63' },
  { id: 'search', label: 'Search', icon: '🔍', color: '#9C27B0' },
];

interface ActionCardProps {
  action: QuickAction;
  onPress: (id: string) => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(action.id)}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
            borderColor: `${action.color}22`,
          },
        ]}
      >
        {/* Accent dot */}
        <View
          style={[styles.accentDot, { backgroundColor: action.color }]}
        />
        <Text style={styles.icon}>{action.icon}</Text>
        <Text style={styles.label} numberOfLines={1}>
          {action.label}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const QuickActions: React.FC<QuickActionsProps> = ({ onActionPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
    >
      {ACTIONS.map((action) => (
        <ActionCard
          key={action.id}
          action={action}
          onPress={onActionPress}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: 12,
  },
  card: {
    width: 80,
    height: 90,
    borderRadius: 16,
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  accentDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    opacity: 0.25,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    textAlign: 'center',
  },
});

export default QuickActions;
