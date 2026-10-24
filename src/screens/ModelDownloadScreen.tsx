/**
 * ModelDownloadScreen - Third step of onboarding
 * Downloads Gemma 4, Whisper STT, and OpenWakeWord models to device storage
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { glassCard } from '../theme/glassmorphic';
import ProgressBar from '../components/ProgressBar';
import GradientButton from '../components/GradientButton';
import ModelManager from '../services/ModelManager';
import { useAppStore } from '../store/appStore';

interface Props {
  navigation: any;
}

export const ModelDownloadScreen: React.FC<Props> = ({ navigation }) => {
  const [wakeProgress, setWakeProgress] = useState(0);
  const [whisperProgress, setWhisperProgress] = useState(0);
  const [llmProgress, setLlmProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const setModelLoaded = useAppStore((state) => state.setModelLoaded);

  const startDownload = async () => {
    setIsDownloading(true);

    try {
      // Step 1: Download Wake Word (5 MB)
      await ModelManager.downloadModel('wakeword', (p) => setWakeProgress(p));
      // Step 2: Download Whisper STT (75 MB)
      await ModelManager.downloadModel('whisper', (p) => setWhisperProgress(p));
      // Step 3: Download Gemma 4 (2.1 GB)
      await ModelManager.downloadModel('llm', (p) => setLlmProgress(p));

      setIsComplete(true);
      setModelLoaded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSkipDevMode = () => {
    setWakeProgress(1);
    setWhisperProgress(1);
    setLlmProgress(1);
    setIsComplete(true);
    setModelLoaded(true);
    navigation.navigate('Permissions');
  };

  const totalProgress = (wakeProgress * 0.05 + whisperProgress * 0.15 + llmProgress * 0.8);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Offline Setup</Text>
        <Text style={styles.subtitle}>
          Downloading AI models to your phone. After this one-time setup, Vaani works 100% offline.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Overall Status Card */}
        <View style={[styles.card, glassCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Total Download Size: ~2.2 GB</Text>
            <Text style={styles.percentageText}>{Math.round(totalProgress * 100)}%</Text>
          </View>
          <ProgressBar progress={totalProgress} height={8} color={colors.accent} />
          <Text style={styles.hintText}>💾 Stored in local app sandbox. No cloud servers contacted.</Text>
        </View>

        {/* Model 1: Wake Word */}
        <View style={[styles.modelItem, glassCard]}>
          <View style={styles.modelIconWrapper}>
            <Text style={styles.modelIcon}>🎯</Text>
          </View>
          <View style={styles.modelDetails}>
            <View style={styles.modelRow}>
              <Text style={styles.modelName}>Wake Word Engine ("Vaani")</Text>
              <Text style={styles.modelSize}>5.2 MB</Text>
            </View>
            <ProgressBar progress={wakeProgress} height={4} color={colors.primary} />
          </View>
        </View>

        {/* Model 2: Whisper STT */}
        <View style={[styles.modelItem, glassCard]}>
          <View style={styles.modelIconWrapper}>
            <Text style={styles.modelIcon}>🗣️</Text>
          </View>
          <View style={styles.modelDetails}>
            <View style={styles.modelRow}>
              <Text style={styles.modelName}>Whisper Speech-to-Text</Text>
              <Text style={styles.modelSize}>75.4 MB</Text>
            </View>
            <ProgressBar progress={whisperProgress} height={4} color={colors.primary} />
          </View>
        </View>

        {/* Model 3: Gemma 4 */}
        <View style={[styles.modelItem, glassCard]}>
          <View style={styles.modelIconWrapper}>
            <Text style={styles.modelIcon}>🧠</Text>
          </View>
          <View style={styles.modelDetails}>
            <View style={styles.modelRow}>
              <Text style={styles.modelName}>Gemma 4 Edge LLM (Q4_K_M)</Text>
              <Text style={styles.modelSize}>2.14 GB</Text>
            </View>
            <ProgressBar progress={llmProgress} height={4} color={colors.accent} />
          </View>
        </View>

        <TouchableOpacity onPress={handleSkipDevMode} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>⚡ Quick Start (Simulate Models Downloaded)</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        {!isComplete ? (
          <GradientButton
            title={isDownloading ? 'Downloading Models...' : 'Start Download (~2.2 GB)'}
            onPress={startDownload}
            disabled={isDownloading}
            variant="primary"
            size="lg"
          />
        ) : (
          <GradientButton
            title="Continue to Permissions"
            onPress={() => navigation.navigate('Permissions')}
            variant="primary"
            size="lg"
          />
        )}
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
  card: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  percentageText: {
    ...typography.body,
    color: colors.accent,
    fontWeight: '700',
  },
  hintText: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  modelIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceGlassLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  modelIcon: {
    fontSize: 22,
  },
  modelDetails: {
    flex: 1,
  },
  modelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  modelName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
    fontSize: 14,
  },
  modelSize: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  skipButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  skipButtonText: {
    ...typography.caption,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
