/**
 * AppNavigator - Navigation Container with Onboarding vs Main Stack
 */

import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store/appStore';
import { colors } from '../theme/theme';

import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LanguageSelectScreen } from '../screens/LanguageSelectScreen';
import { ModelDownloadScreen } from '../screens/ModelDownloadScreen';
import { PermissionsScreen } from '../screens/PermissionsScreen';
import { SetupCompleteScreen } from '../screens/SetupCompleteScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootStackParamList = {
  Welcome: undefined;
  LanguageSelect: undefined;
  ModelDownload: undefined;
  Permissions: undefined;
  SetupComplete: undefined;
  Home: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isSetupComplete = useAppStore((state) => state.isSetupComplete);

  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!isSetupComplete ? (
          // Onboarding Flow
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
            <Stack.Screen name="ModelDownload" component={ModelDownloadScreen} />
            <Stack.Screen name="Permissions" component={PermissionsScreen} />
            <Stack.Screen name="SetupComplete" component={SetupCompleteScreen} />
          </>
        ) : (
          // Main App Flow
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
