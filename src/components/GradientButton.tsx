import React, { useRef } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
}

const SIZE_CONFIG: Record<ButtonSize, { height: number; paddingH: number; fontSize: number }> = {
  sm: { height: 36, paddingH: spacing.md, fontSize: typography.sizes.caption },
  md: { height: 48, paddingH: spacing.lg, fontSize: typography.sizes.body },
  lg: { height: 56, paddingH: spacing.xl, fontSize: typography.sizes.subtitle },
};

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sizeConfig = SIZE_CONFIG[size];

  const handlePressIn = () => {
    if (disabled || loading) {return;}
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) {return;}
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [
      styles.container,
      {
        height: sizeConfig.height,
        paddingHorizontal: sizeConfig.paddingH,
        borderRadius: sizeConfig.height / 2,
      },
    ];

    switch (variant) {
      case 'primary':
        base.push(styles.containerPrimary);
        break;
      case 'secondary':
        base.push(styles.containerSecondary);
        break;
      case 'outline':
        base.push(styles.containerOutline);
        break;
    }

    if (disabled) {
      base.push(styles.containerDisabled);
    }

    return base;
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle[] = [
      styles.text,
      { fontSize: sizeConfig.fontSize },
    ];

    switch (variant) {
      case 'primary':
        base.push(styles.textPrimary);
        break;
      case 'secondary':
        base.push(styles.textSecondary);
        break;
      case 'outline':
        base.push(styles.textOutline);
        break;
    }

    return base;
  };

  const spinnerColor = variant === 'outline' ? colors.primary : colors.text;

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={disabled || loading ? undefined : onPress}
    >
      <Animated.View
        style={[
          ...getContainerStyle(),
          { transform: [{ scale: scaleAnim }] },
          style,
        ]}
      >
        {/* Simulated gradient highlight for primary */}
        {variant === 'primary' && !disabled && (
          <Animated.View style={styles.gradientOverlay} />
        )}

        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
          <>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  containerPrimary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  containerSecondary: {
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  containerDisabled: {
    opacity: 0.45,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 217, 255, 0.12)',
    borderRadius: 999,
    // Shift overlay to the right to simulate a left-to-right gradient
    left: '50%',
  },
  text: {
    fontWeight: '600',
  },
  textPrimary: {
    color: colors.text,
  },
  textSecondary: {
    color: colors.text,
  },
  textOutline: {
    color: colors.primary,
  },
  icon: {
    fontSize: 16,
  },
});

export default GradientButton;
