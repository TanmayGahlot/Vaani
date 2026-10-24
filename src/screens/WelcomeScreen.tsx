/**
 * WelcomeScreen - First step of onboarding
 * Introducing Vaani with animated glowing orb and offline privacy value prop
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { glassCard } from '../theme/glassmorphic';
import GradientButton from '../components/GradientButton';

interface Props {
  navigation: any;
}

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 2400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.7,
            duration: 2400,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 2400,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [pulseAnim, glowAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Background radial glow */}
      <View style={styles.glowContainer}>
        <Animated.View
          style={[
            styles.glowCircle,
            {
              transform: [{ scale: pulseAnim }],
              opacity: glowAnim,
            },
          ]}
        />
      </View>

      {/* Central Visual */}
      <View style={styles.centerSection}>
        <View style={styles.orbWrapper}>
          <Text style={styles.orbEmoji}>🎙️</Text>
        </View>

        <Text style={styles.appName}>वाणी (Vaani)</Text>
        <Text style={styles.tagline}>Your Voice. Your Language. Your Phone.</Text>

        <View style={[styles.badgeCard, glassCard]}>
          <Text style={styles.badgeText}>🔒 100% Offline • Powered by Gemma 4</Text>
        </View>

        <Text style={styles.description}>
          Control your entire Android device using natural voice commands in your mother tongue.
          No internet connection, no subscription, zero data leaves your phone.
        </Text>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
        <GradientButton
          title="Get Started"
          onPress={() => navigation.navigate('LanguageSelect')}
          variant="primary"
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
    opacity: 0.25,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  orbWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surfaceGlassLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  orbEmoji: {
    fontSize: 48,
  },
  appName: {
    ...typography.h1,
    color: colors.text,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  badgeCard: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  bottomSection: {
    paddingBottom: spacing.xl,
  },
});
