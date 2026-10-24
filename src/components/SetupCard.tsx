import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

interface SetupCardProps {
  icon: string;
  title: string;
  description: string;
  isActive?: boolean;
  isCompleted?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const SetupCard: React.FC<SetupCardProps> = ({
  icon,
  title,
  description,
  isActive = false,
  isCompleted = false,
  onPress,
  children,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) {return;}
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) {return;}
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        isActive && styles.cardActive,
        isCompleted && styles.cardCompleted,
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      {/* Completed overlay */}
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedCheck}>✓</Text>
        </View>
      )}

      <View style={styles.row}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            isActive && styles.iconContainerActive,
            isCompleted && styles.iconContainerCompleted,
          ]}
        >
          <Text style={styles.icon}>{icon}</Text>
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              isCompleted && styles.titleCompleted,
            ]}
          >
            {title}
          </Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      {/* Optional children slot */}
      {children && <View style={styles.childrenContainer}>{children}</View>}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        {cardContent}
      </TouchableWithoutFeedback>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  cardActive: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  cardCompleted: {
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  completedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 4,
  },
  completedCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
  },
  iconContainerCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  titleCompleted: {
    color: colors.textSecondary,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    lineHeight: 18,
  },
  childrenContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default SetupCard;
