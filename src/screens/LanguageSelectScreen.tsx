/**
 * LanguageSelectScreen - Second step of onboarding
 * Select regional Indian language or English
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { colors, typography, spacing } from '../theme/theme';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../utils/constants';
import { useAppStore } from '../store/appStore';
import LanguageCard from '../components/LanguageCard';
import GradientButton from '../components/GradientButton';

interface Props {
  navigation: any;
}

export const LanguageSelectScreen: React.FC<Props> = ({ navigation }) => {
  const selectedLanguage = useAppStore((state) => state.selectedLanguage);
  const setLanguageInStore = useAppStore((state) => state.setLanguage);

  const [currentSelected, setCurrentSelected] = useState<string>(selectedLanguage || 'hi');

  const handleSelect = (lang: SupportedLanguage) => {
    setCurrentSelected(lang.code);
    setLanguageInStore(lang.code);
  };

  const isSetupComplete = useAppStore((state) => state.isSetupComplete);

  const handleContinue = () => {
    if (isSetupComplete) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Home');
      }
    } else {
      navigation.navigate('ModelDownload');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.subtitle}>
          वाणी (Vaani) speaks and understands your mother tongue completely offline.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <View key={lang.code} style={styles.gridItem}>
              <LanguageCard
                language={lang}
                isSelected={currentSelected === lang.code}
                onPress={() => handleSelect(lang)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton
          title="Continue"
          onPress={handleContinue}
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
    marginBottom: spacing.lg,
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
  scrollList: {
    paddingBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: spacing.md,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
