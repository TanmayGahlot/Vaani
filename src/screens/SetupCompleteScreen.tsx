/**
 * SetupCompleteScreen - Final step of onboarding
 * Confirms setup and activates the wake word engine
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { glassCard } from '../theme/glassmorphic';
import GradientButton from '../components/GradientButton';
import { useAppStore } from '../store/appStore';

interface Props {
  navigation: any;
}

export const SetupCompleteScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  const setSetupComplete = useAppStore((state) => state.setSetupComplete);
  const setWakeWordEnabled = useAppStore((state) => state.setWakeWordEnabled);

  const checkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(checkScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [checkScale]);

  const handleLaunchHome = () => {
    setSetupComplete(true);
    setWakeWordEnabled(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.checkCircle,
            { transform: [{ scale: checkScale }] },
          ]}
        >
          <Text style={styles.checkIcon}>✓</Text>
        </Animated.View>

        <Text style={styles.title}>You're All Set!</Text>
        <Text style={styles.subtitle}>
          Say <Text style={styles.highlight}>"Vaani"</Text> at any time, or tap the microphone to begin.
        </Text>

        <View style={[styles.infoCard, glassCard]}>
          <Text style={styles.infoTitle}>Try saying:</Text>
          <Text style={styles.exampleText}>• "Vaani, call Mom"</Text>
          <Text style={styles.exampleText}>• "वाणी, राहुल को व्हाट्सएप पर मैसेज भेजो"</Text>
          <Text style={styles.exampleText}>• "Vaani, set alarm for 7 AM"</Text>
          <Text style={styles.exampleText}>• "वाणी, यूट्यूब खोलो"</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <GradientButton
          title="Open Vaani Assistant"
          onPress={handleLaunchHome}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  checkIcon: {
    fontSize: 44,
    color: colors.text,
    fontWeight: '800',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
    maxWidth: 280,
  },
  highlight: {
    color: colors.accent,
    fontWeight: '700',
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    width: '100%',
  },
  infoTitle: {
    ...typography.body,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  exampleText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 24,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
