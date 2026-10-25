/**
 * HomeScreen - Primary Assistant UI
 * Matches reference designs:
 * 1. Siri-style bottom translucent glow bar & floating notification overlay
 * 2. Clean modern glassmorphic chat interface with quick action cards
 *    (Translate, Audio Chat, Chat Files, Phone Control)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { glassCard, glassCardElevated, glassButton } from '../theme/glassmorphic';
import VoiceOrb from '../components/VoiceOrb';
import ChatBubble from '../components/ChatBubble';
import WaveformVisualizer from '../components/WaveformVisualizer';
import { useVoiceAgent } from '../hooks/useVoiceAgent';
import { useWakeWord } from '../hooks/useWakeWord';
import { useAppStore } from '../store/appStore';

interface Props {
  navigation: any;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [activeOverlayNotification, setActiveOverlayNotification] = useState<{
    sender: string;
    message: string;
    time: string;
  } | null>({
    sender: 'Aga',
    message: 'Have you heard of Calathea? It’s a patterned tropical houseplant...',
    time: '9:14 AM',
  });

  const conversationHistory = useAppStore((state) => state.conversationHistory);
  const selectedLanguage = useAppStore((state) => state.selectedLanguage);
  const currentAction = useAppStore((state) => state.currentAction);

  const {
    isListening,
    isProcessing,
    lastTranscript,
    error,
    clearError,
    toggleListening,
    processVoiceCommand,
  } = useVoiceAgent();

  // Background wake word detection listener
  useWakeWord(() => {
    console.log('[HomeScreen] Wake word "Vaani" invoked!');
    toggleListening();
  });

  const VOICE_SUGGESTIONS = [
    { id: '1', emoji: '🕒', label: 'What time is it?', query: 'What is the current time?' },
    { id: '2', emoji: '⚙️', label: 'Open Settings', query: 'Open Settings' },
    { id: '3', emoji: '📷', label: 'Open Camera', query: 'Open Camera' },
    { id: '4', emoji: '📞', label: 'Call Dad', query: 'Call Dad' },
    { id: '5', emoji: '💬', label: 'WhatsApp Rahul', query: 'Send WhatsApp message to Rahul' },
    { id: '6', emoji: '⏰', label: 'Alarm 7 AM', query: 'Set alarm for 7 AM' },
    { id: '7', emoji: '🌐', label: 'Translate Hello', query: 'Translate Hello to Hindi' },
  ];

  const handleSendText = () => {
    if (!inputText.trim()) {return;}
    const text = inputText;
    setInputText('');
    clearError();
    processVoiceCommand(text);
  };

  const handleQuickAction = (_actionTitle: string, promptTemplate: string) => {
    clearError();
    processVoiceCommand(promptTemplate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.avatarRow}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>👩</Text>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.userName}>Hi, Marry!</Text>
            <Text style={styles.welcomeText}>How can I help you?</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.settingsButton, glassButton]}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Siri / Notification Floating Pill Banner (From Reference Image 1) */}
        {activeOverlayNotification && (
          <View style={[styles.notificationCard, glassCardElevated]}>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationSenderRow}>
                <View style={styles.senderAvatar}>
                  <Text style={styles.senderAvatarText}>👧</Text>
                </View>
                <View>
                  <Text style={styles.notificationSender}>
                    {activeOverlayNotification.sender}
                  </Text>
                  <Text style={styles.notificationSummary}>
                    Aga sent you a message about Calathea
                  </Text>
                </View>
              </View>
              <Text style={styles.notificationTime}>
                {activeOverlayNotification.time}
              </Text>
            </View>
            <Text style={styles.notificationBody}>
              "{activeOverlayNotification.message}"
            </Text>
            <View style={styles.notificationActionRow}>
              <TouchableOpacity
                style={styles.notifActionButton}
                onPress={() =>
                  processVoiceCommand('Read notification aloud and reply I will check it out')
                }
              >
                <Text style={styles.notifActionText}>Reply with Vaani</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveOverlayNotification(null)}
              >
                <Text style={styles.dismissText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 2x2 Feature Quick Cards (From Reference Image 2) */}
        <View style={styles.cardsGrid}>
          {/* Card 1: Translate */}
          <TouchableOpacity
            style={[styles.featureCard, glassCard]}
            onPress={() => handleQuickAction('Translate', 'Translate how are you to Hindi')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBadge, styles.iconBadgeBlue]}>
              <Text style={styles.cardEmoji}>🌐</Text>
            </View>
            <Text style={styles.cardTitle}>Translate</Text>
            <Text style={styles.cardSubtitle}>Real-time regional speech</Text>
          </TouchableOpacity>

          {/* Card 2: Audio Chat */}
          <TouchableOpacity
            style={[styles.featureCard, glassCard]}
            onPress={toggleListening}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBadge, styles.iconBadgePurple]}>
              <Text style={styles.cardEmoji}>🎙️</Text>
            </View>
            <Text style={styles.cardTitle}>Audio Chat</Text>
            <Text style={styles.cardSubtitle}>Offline Gemma 4 voice</Text>
          </TouchableOpacity>

          {/* Card 3: Phone Actions / Messaging */}
          <TouchableOpacity
            style={[styles.featureCard, glassCard]}
            onPress={() => handleQuickAction('Call', 'Call Mom right now')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBadge, styles.iconBadgeGreen]}>
              <Text style={styles.cardEmoji}>📞</Text>
            </View>
            <Text style={styles.cardTitle}>Voice Call</Text>
            <Text style={styles.cardSubtitle}>Hands-free accessibility</Text>
          </TouchableOpacity>

          {/* Card 4: Open Apps & Automate */}
          <TouchableOpacity
            style={[styles.featureCard, glassCard]}
            onPress={() => handleQuickAction('Open WhatsApp', 'Open WhatsApp and send message')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBadge, styles.iconBadgeCyan]}>
              <Text style={styles.cardEmoji}>📱</Text>
            </View>
            <Text style={styles.cardTitle}>Phone Control</Text>
            <Text style={styles.cardSubtitle}>Operate apps via voice</Text>
          </TouchableOpacity>
        </View>

        {/* Real-time Intent / Action status card */}
        {currentAction && (
          <View style={[styles.actionBanner, glassCardElevated]}>
            <Text style={styles.actionBannerEmoji}>⚡</Text>
            <View style={styles.actionBannerContent}>
              <Text style={styles.actionBannerTitle}>Automating Action</Text>
              <Text style={styles.actionBannerDetail}>
                {currentAction.type}: {currentAction.responseText}
              </Text>
            </View>
          </View>
        )}

        {/* Conversation List */}
        <View style={styles.chatSection}>
          <Text style={styles.sectionTitle}>Conversation</Text>
          {conversationHistory.length === 0 ? (
            <View style={[styles.emptyChatCard, glassCard]}>
              <Text style={styles.emptyChatText}>
                No messages yet. Say "Vaani", tap the mic, or tap any quick suggestion below!
              </Text>
            </View>
          ) : (
            conversationHistory.map((item, index) => (
              <ChatBubble
                key={item.id || index.toString()}
                message={item}
                isLatest={index === conversationHistory.length - 1}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Siri-Style Bottom Translucent Bar */}
      <View style={styles.bottomBarContainer}>
        {/* Horizontal Quick Voice Suggestions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionScroll}
          contentContainerStyle={styles.suggestionScrollContent}
        >
          {VOICE_SUGGESTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.suggestionChip, glassCard]}
              onPress={() => {
                clearError();
                processVoiceCommand(item.query);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionEmoji}>{item.emoji}</Text>
              <Text style={styles.suggestionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Glow backdrop during active speech recognition */}
        {isListening && (
          <View style={styles.listeningGlowBackdrop}>
            <WaveformVisualizer isActive={true} color={colors.accent} />
            <Text style={styles.listeningStatusText}>
              {lastTranscript
                ? `"${lastTranscript}"`
                : `Listening in ${selectedLanguage.toUpperCase()}... Speak your command`}
            </Text>
          </View>
        )}

        {/* Friendly Error / Fallback Banner with One-Tap Sample & Dismiss */}
        {error && !isListening && (
          <View style={[styles.errorCard, glassCardElevated]}>
            <View style={styles.errorHeaderRow}>
              <Text style={styles.errorTitle}>⚠️ {error}</Text>
              <TouchableOpacity onPress={clearError} style={styles.dismissButton}>
                <Text style={styles.dismissButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.errorActionBtn}
              onPress={() => {
                clearError();
                processVoiceCommand('What is the current time?');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.errorActionBtnText}>▶️ Tap to Test: "What is the time?"</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.inputGlassBar, glassCardElevated]}>
          <TouchableOpacity
            style={styles.micOrbWrapper}
            onPress={toggleListening}
            activeOpacity={0.8}
          >
            <VoiceOrb
              isListening={isListening}
              isProcessing={isProcessing}
              onPress={toggleListening}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder={isListening ? 'Listening...' : 'Ask Vaani anything...'}
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendText}
            returnKeyType="send"
          />

          <TouchableOpacity
            style={[styles.sendButton, inputText.trim().length > 0 && styles.sendButtonActive]}
            onPress={handleSendText}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceGlassLight,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 26,
  },
  greetingContainer: {},
  userName: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  welcomeText: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 18,
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 220,
    paddingTop: spacing.sm,
  },
  notificationCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  notificationSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(233, 30, 99, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  senderAvatarText: {
    fontSize: 18,
  },
  notificationSender: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    fontSize: 14,
  },
  notificationSummary: {
    ...typography.small,
    color: colors.textSecondary,
  },
  notificationTime: {
    ...typography.small,
    color: colors.textMuted,
  },
  notificationBody: {
    ...typography.body,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  notificationActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
  notifActionButton: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  notifActionText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  dismissText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  featureCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconBadgeBlue: {
    backgroundColor: 'rgba(66, 133, 244, 0.15)',
  },
  iconBadgePurple: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
  },
  iconBadgeGreen: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  iconBadgeCyan: {
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    fontSize: 15,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  actionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(0, 217, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  actionBannerEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionBannerContent: {
    flex: 1,
  },
  actionBannerTitle: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionBannerDetail: {
    ...typography.body,
    color: colors.text,
    fontSize: 13,
  },
  chatSection: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptyChatCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  emptyChatText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    backgroundColor: 'rgba(10, 10, 15, 0.94)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  listeningGlowBackdrop: {
    backgroundColor: 'rgba(10, 10, 15, 0.92)',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  listeningStatusText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  errorBackdrop: {
    borderColor: colors.warning,
    paddingVertical: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.warning,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputGlassBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  micOrbWrapper: {
    marginRight: spacing.xs,
  },
  textInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceGlassLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendIcon: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  suggestionScroll: {
    marginBottom: spacing.xs,
  },
  suggestionScrollContent: {
    paddingHorizontal: 2,
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(20, 22, 35, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  suggestionEmoji: {
    fontSize: 13,
    marginRight: 5,
  },
  suggestionLabel: {
    ...typography.caption,
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: 'rgba(28, 20, 20, 0.95)',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  errorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorTitle: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.xs,
  },
  dismissButton: {
    padding: 4,
  },
  dismissButtonText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  errorActionBtn: {
    marginTop: 6,
    backgroundColor: 'rgba(255, 179, 0, 0.15)',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: borderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  errorActionBtnText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
    fontSize: 11,
  },
});
