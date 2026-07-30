import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../theme';
import { useColorScheme } from 'nativewind';
import '../services/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/useSettingsStore';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme();
  const language = useSettingsStore((state) => state.language);
  const { i18n } = useTranslation();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    // Hide splash screen immediately for now
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // Synchronize the NativeWind global color scheme with our Zustand store
    setColorScheme(theme.mode === 'sepia' ? 'light' : theme.mode);
  }, [theme.mode, setColorScheme]);

  useEffect(() => {
    // Synchronize i18n language
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bg.base },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reader/[documentId]" options={{ headerShown: false }} />
        <Stack.Screen name="reader/[documentId]/toc" options={{ presentation: 'modal' }} />
        <Stack.Screen name="folder/[id]" />
        <Stack.Screen name="document-info/[documentId]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="import" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
