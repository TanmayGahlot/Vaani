/**
 * PermissionsScreen - Fourth step of onboarding
 * Requests Microphone, Accessibility Service, and Overlay permissions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { glassCard } from '../theme/glassmorphic';
import GradientButton from '../components/GradientButton';
import PhoneActionService from '../services/PhoneActionService';

interface Props {
  navigation: any;
}

export const PermissionsScreen: React.FC<Props> = ({ navigation }) => {
  const [micGranted, setMicGranted] = useState(true);
  const [accessibilityGranted, setAccessibilityGranted] = useState(false);
  const [overlayGranted, setOverlayGranted] = useState(false);
  const [backgroundGranted, setBackgroundGranted] = useState(true);

  const handleOpenAccessibility = () => {
    setAccessibilityGranted(true);
    PhoneActionService.openAccessibilitySettings();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>System Permissions</Text>
        <Text style={styles.subtitle}>
          To operate your phone hands-free like Bixby or Siri, Vaani requires accessibility and voice access.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Permission 1: Microphone */}
        <View style={[styles.permCard, glassCard]}>
          <View style={styles.permHeader}>
            <View style={styles.permIconWrapper}>
              <Text style={styles.permIcon}>🎤</Text>
            </View>
            <View style={styles.permInfo}>
              <Text style={styles.permTitle}>Microphone Access</Text>
              <Text style={styles.permDesc}>
                Listens for the "Vaani" wake word and your spoken instructions locally.
              </Text>
            </View>
            <Switch
              value={micGranted}
              onValueChange={setMicGranted}
              trackColor={{ false: colors.surface, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        {/* Permission 2: Accessibility Service */}
        <View style={[styles.permCard, glassCard]}>
          <View style={styles.permHeader}>
            <View style={styles.permIconWrapper}>
              <Text style={styles.permIcon}>📱</Text>
            </View>
            <View style={styles.permInfo}>
              <Text style={styles.permTitle}>Accessibility Service</Text>
              <Text style={styles.permDesc}>
                Enables Vaani to tap buttons, open apps, send messages, and navigate without touch.
              </Text>
            </View>
            <Switch
              value={accessibilityGranted}
              onValueChange={handleOpenAccessibility}
              trackColor={{ false: colors.surface, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        {/* Permission 3: Display Over Other Apps */}
        <View style={[styles.permCard, glassCard]}>
          <View style={styles.permHeader}>
            <View style={styles.permIconWrapper}>
              <Text style={styles.permIcon}>✨</Text>
            </View>
            <View style={styles.permInfo}>
              <Text style={styles.permTitle}>Screen Overlay</Text>
              <Text style={styles.permDesc}>
                Shows the Siri-style glowing voice orb when you say "Vaani" over any app.
              </Text>
            </View>
            <Switch
              value={overlayGranted}
              onValueChange={setOverlayGranted}
              trackColor={{ false: colors.surface, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        {/* Permission 4: Background Service */}
        <View style={[styles.permCard, glassCard]}>
          <View style={styles.permHeader}>
            <View style={styles.permIconWrapper}>
              <Text style={styles.permIcon}>🔋</Text>
            </View>
            <View style={styles.permInfo}>
              <Text style={styles.permTitle}>Always-On Listening</Text>
              <Text style={styles.permDesc}>
                Maintains a low-power wake word foreground service so you never need to unlock or open the app first.
              </Text>
            </View>
            <Switch
              value={backgroundGranted}
              onValueChange={setBackgroundGranted}
              trackColor={{ false: colors.surface, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton
          title="Finish Setup"
          onPress={() => navigation.navigate('SetupComplete')}
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
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  content: {
    paddingBottom: spacing.lg,
  },
  permCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  permHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceGlassLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  permIcon: {
    fontSize: 22,
  },
  permInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  permTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  permDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
