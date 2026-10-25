import React, { useEffect, useRef } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageCardProps {
  language: Language;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  isSelected,
  onPress,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const selectionAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(selectionAnim, {
      toValue: isSelected ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isSelected, selectionAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  const selectedScale = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const combinedScale = Animated.multiply(scaleAnim, selectedScale);

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          {
            transform: [{ scale: combinedScale }],
          },
          style,
        ]}
      >
        {/* Native name (prominent) */}
        <Text
          style={[
            styles.nativeName,
            isSelected && styles.nativeNameSelected,
          ]}
          numberOfLines={1}
        >
          {language.nativeName}
        </Text>

        {/* English name (secondary) */}
        <Text style={styles.englishName} numberOfLines={1}>
          {language.name}
        </Text>

        {/* Language code badge */}
        <Animated.View
          style={[
            styles.codeBadge,
            isSelected ? styles.codeBadgeSelected : styles.codeBadgeUnselected,
            {
              opacity: selectionAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ]}
        >
          <Text
            style={[
              styles.codeText,
              isSelected && styles.codeTextSelected,
            ]}
          >
            {language.code.toUpperCase()}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    gap: 4,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  nativeName: {
    color: colors.text,
    fontSize: typography.sizes.subtitle,
    fontWeight: '700',
    textAlign: 'center',
  },
  nativeNameSelected: {
    color: colors.primary,
  },
  englishName: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    textAlign: 'center',
  },
  codeBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeBadgeSelected: {
    backgroundColor: 'rgba(108, 99, 255, 0.25)',
  },
  codeBadgeUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  codeText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  codeTextSelected: {
    color: colors.primary,
  },
});

export default LanguageCard;
