/**
 * SettingsScreen - Preferences, Wake Word & Model Management
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { glassCard } from '../theme/glassmorphic';
import { useAppStore } from '../store/appStore';
import PhoneActionService from '../services/PhoneActionService';
import { SUPPORTED_LANGUAGES } from '../utils/constants';

interface Props {
  navigation: any;
}

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const selectedLanguage = useAppStore((state) => state.selectedLanguage);
  const wakeWordEnabled = useAppStore((state) => state.wakeWordEnabled);
  const setWakeWordEnabled = useAppStore((state) => state.setWakeWordEnabled);
  const clearHistory = useAppStore((state) => state.clearHistory);

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Language Section */}
        <Text style={styles.sectionHeader}>Speech & Language</Text>
        <TouchableOpacity
          style={[styles.itemCard, glassCard]}
          onPress={() => navigation.navigate('LanguageSelect')}
        >
          <View>
            <Text style={styles.itemTitle}>Primary Language</Text>
            <Text style={styles.itemSubtitle}>
              {langObj ? `${langObj.name} (${langObj.nativeName})` : 'Hindi (हिन्दी)'}
            </Text>
          </View>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>

        {/* Wake Word Section */}
        <Text style={styles.sectionHeader}>Voice Activation</Text>
        <View style={[styles.itemCard, glassCard]}>
          <View style={styles.itemTextContainerWithMargin}>
            <Text style={styles.itemTitle}>"Vaani" Wake Word</Text>
            <Text style={styles.itemSubtitle}>
              Wake the assistant automatically anytime by saying "Vaani"
            </Text>
          </View>
          <Switch
            value={wakeWordEnabled}
            onValueChange={setWakeWordEnabled}
            trackColor={{ false: colors.surface, true: colors.primary }}
            thumbColor={colors.text}
          />
        </View>

        {/* Accessibility Section */}
        <Text style={styles.sectionHeader}>Phone Automation</Text>
        <TouchableOpacity
          style={[styles.itemCard, glassCard]}
          onPress={() => PhoneActionService.openAccessibilitySettings()}
        >
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Android Accessibility Service</Text>
            <Text style={styles.itemSubtitle}>
              Required for hands-free WhatsApp messaging, calls & app control
            </Text>
          </View>
          <Text style={styles.arrowIcon}>⚙️</Text>
        </TouchableOpacity>

        {/* Offline Models Info */}
        <Text style={styles.sectionHeader}>Offline AI Models</Text>
        <View style={[styles.itemCard, glassCard]}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Gemma 4 Edge LLM (Q4_K_M)</Text>
            <Text style={styles.itemSubtitle}>2.14 GB • Loaded in RAM via llama.rn</Text>
          </View>
          <Text style={styles.statusBadge}>Ready</Text>
        </View>

        <View style={[styles.itemCard, glassCard]}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Whisper Multilingual STT</Text>
            <Text style={styles.itemSubtitle}>75.4 MB • Offline on-device</Text>
          </View>
          <Text style={styles.statusBadge}>Ready</Text>
        </View>

        {/* Data & History */}
        <Text style={styles.sectionHeader}>Privacy & Data</Text>
        <TouchableOpacity
          style={[styles.itemCard, glassCard]}
          onPress={clearHistory}
        >
          <View>
            <Text style={[styles.itemTitle, { color: colors.error }]}>
              Clear Conversation History
            </Text>
            <Text style={styles.itemSubtitle}>Erase local chat logs from storage</Text>
          </View>
          <Text style={styles.arrowIcon}>🗑️</Text>
        </TouchableOpacity>

        {/* About Card */}
        <View style={[styles.aboutCard, glassCard]}>
          <Text style={styles.aboutTitle}>वाणी (Vaani) v1.0.0</Text>
          <Text style={styles.aboutText}>
            Built with Gemma 4, whisper.rn, and openWakeWord. Made for the millions of people who need
            device accessibility without touchscreen friction.
          </Text>
          <Text style={styles.aboutFooter}>
            🇮🇳 Made with ❤️ for Indian regional languages & offline accessibility
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceGlassLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: colors.text,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 36,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTextContainerWithMargin: {
    flex: 1,
    marginRight: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  itemTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  itemSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  arrowIcon: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  statusBadge: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '700',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  aboutCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  aboutTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  aboutText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  aboutFooter: {
    ...typography.small,
    color: colors.accent,
    textAlign: 'center',
  },
});
