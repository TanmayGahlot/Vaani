import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/theme';

interface WaveformVisualizerProps {
  isActive: boolean;
  color?: string;
  style?: ViewStyle;
}

const BAR_COUNT = 5;
const BAR_WIDTH = 4;
const BAR_MAX_HEIGHT = 32;
const BAR_MIN_HEIGHT = 6;
const BAR_GAP = 5;

/** Fixed target heights per bar to simulate different audio frequencies. */
const BAR_PATTERNS = [0.5, 0.9, 0.6, 1.0, 0.4];
/** Animation durations per bar (ms) – varied for a natural look. */
const BAR_DURATIONS = [400, 300, 500, 350, 450];

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isActive,
  color = colors.primary,
  style,
}) => {
  const barAnims = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(BAR_MIN_HEIGHT)),
  ).current;

  useEffect(() => {
    if (isActive) {
      const animations = barAnims.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: BAR_MIN_HEIGHT + BAR_PATTERNS[index] * (BAR_MAX_HEIGHT - BAR_MIN_HEIGHT),
              duration: BAR_DURATIONS[index],
              useNativeDriver: false, // height can't use native driver
            }),
            Animated.timing(anim, {
              toValue: BAR_MIN_HEIGHT,
              duration: BAR_DURATIONS[index],
              useNativeDriver: false,
            }),
          ]),
        ),
      );
      animations.forEach((a) => a.start());
      return () => animations.forEach((a) => a.stop());
    } else {
      // Ease bars to minimum height
      Animated.parallel(
        barAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: BAR_MIN_HEIGHT,
            duration: 250,
            useNativeDriver: false,
          }),
        ),
      ).start();
    }
  }, [isActive, barAnims]);

  const totalWidth = BAR_COUNT * BAR_WIDTH + (BAR_COUNT - 1) * BAR_GAP;

  return (
    <View style={[styles.container, { width: totalWidth }, style]}>
      {barAnims.map((anim, index) => (
        <Animated.View
          key={`bar-${index}`}
          style={[
            styles.bar,
            {
              height: anim,
              backgroundColor: color,
              opacity: 0.6 + BAR_PATTERNS[index] * 0.4,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: BAR_MAX_HEIGHT,
    gap: BAR_GAP,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
    minHeight: BAR_MIN_HEIGHT,
  },
});

export default WaveformVisualizer;
