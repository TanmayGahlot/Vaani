import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme/theme';

interface ProgressBarProps {
  progress: number; // 0 – 1
  color?: string;
  height?: number;
  showPercentage?: boolean;
  style?: ViewStyle;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primary,
  height = 8,
  showPercentage = false,
  style,
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  // Clamp progress between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: clampedProgress,
      duration: 400,
      useNativeDriver: false, // width percentage can't use native driver
    }).start();
  }, [clampedProgress, widthAnim]);

  const widthInterpolation = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.wrapper, style]}>
      {/* Track */}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        {/* Filled bar */}
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolation,
              height,
              borderRadius: height / 2,
              backgroundColor: color,
            },
          ]}
        >
          {/* Leading-edge highlight for gradient-like effect */}
          <View
            style={[
              styles.highlight,
              {
                height,
                borderRadius: height / 2,
              },
            ]}
          />
        </Animated.View>
      </View>

      {/* Percentage label */}
      {showPercentage && (
        <Text style={styles.percentage}>
          {Math.round(clampedProgress * 100)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  track: {
    flex: 1,
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    position: 'relative',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    right: 0,
    width: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  percentage: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'right',
  },
});

export default ProgressBar;
