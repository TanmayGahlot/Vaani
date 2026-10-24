import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/theme';

interface VoiceOrbProps {
  isListening: boolean;
  isProcessing: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const ORB_SIZE = 80;
const RING_COUNT = 3;

const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isListening,
  isProcessing,
  onPress,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const ringAnims = useRef(
    Array.from({ length: RING_COUNT }, () => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0),
    })),
  ).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Press animation
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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

  // Listening: pulsing rings
  useEffect(() => {
    if (isListening) {
      // Glow brighter
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Ripple rings staggered
      ringAnims.forEach((ring, index) => {
        const delay = index * 400;
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(ring.scale, {
                toValue: 2.2,
                duration: 1200,
                useNativeDriver: true,
              }),
              Animated.timing(ring.opacity, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(ring.scale, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(ring.opacity, {
                toValue: 0.6,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ).start();
      });
    } else {
      // Reset rings
      glowAnim.stopAnimation();
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      ringAnims.forEach((ring) => {
        ring.scale.stopAnimation();
        ring.opacity.stopAnimation();
        Animated.parallel([
          Animated.timing(ring.scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(ring.opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [isListening, glowAnim, ringAnims]);

  // Processing: spinning dots
  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [isProcessing, spinAnim]);

  const spinInterpolation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const DOT_COUNT = 8;
  const DOT_RADIUS = ORB_SIZE / 2 + 16;
  const processingDots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (i / DOT_COUNT) * 2 * Math.PI;
    const x = Math.cos(angle) * DOT_RADIUS;
    const y = Math.sin(angle) * DOT_RADIUS;
    return { x, y, delay: i * 100 };
  });

  return (
    <View style={[styles.container, style]}>
      {/* Pulsing rings (listening state) */}
      {ringAnims.map((ring, index) => (
        <Animated.View
          key={`ring-${index}`}
          style={[
            styles.ring,
            {
              transform: [{ scale: ring.scale }],
              opacity: ring.opacity,
            },
          ]}
        />
      ))}

      {/* Processing spinner dots */}
      {isProcessing && (
        <Animated.View
          style={[
            styles.dotsContainer,
            { transform: [{ rotate: spinInterpolation }] },
          ]}
        >
          {processingDots.map((dot, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.spinnerDot,
                {
                  left: ORB_SIZE / 2 + dot.x - 3,
                  top: ORB_SIZE / 2 + dot.y - 3,
                  opacity: 0.3 + (index / DOT_COUNT) * 0.7,
                },
              ]}
            />
          ))}
        </Animated.View>
      )}

      {/* Glow layer */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowAnim,
          },
        ]}
      />

      {/* Main orb button */}
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View
          style={[
            styles.orb,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.orbInner}>
            <Animated.Text
              style={[
                styles.micIcon,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ]}
            >
              🎤
            </Animated.Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Glass shadow underneath */}
      <View style={styles.shadow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ORB_SIZE + 80,
    height: ORB_SIZE + 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    zIndex: 10,
  },
  orbInner: {
    width: ORB_SIZE - 4,
    height: ORB_SIZE - 4,
    borderRadius: (ORB_SIZE - 4) / 2,
    backgroundColor: 'rgba(108, 99, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  micIcon: {
    fontSize: 28,
  },
  glow: {
    position: 'absolute',
    width: ORB_SIZE + 40,
    height: ORB_SIZE + 40,
    borderRadius: (ORB_SIZE + 40) / 2,
    backgroundColor: colors.primary,
    opacity: 0,
    zIndex: 1,
  },
  ring: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 5,
  },
  dotsContainer: {
    position: 'absolute',
    width: ORB_SIZE + 32,
    height: ORB_SIZE + 32,
    zIndex: 8,
  },
  spinnerDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  shadow: {
    position: 'absolute',
    bottom: 10,
    width: ORB_SIZE * 0.7,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(108, 99, 255, 0.3)',
    zIndex: 0,
  },
});

export default VoiceOrb;
