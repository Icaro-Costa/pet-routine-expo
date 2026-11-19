import '../../global.css';
import { useEffect } from 'react';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../context/theme-context';
import { configurarNotificacoes } from '../services/notifications';
import { useAuthStore } from '../store/use-auth-store';

function AppNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const sessionToken = useAuthStore((state) => state.sessionToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (!isHydrated) return;

    const estaNaAreaDeAutenticacao = segments[0] === '(auth)';

    if (!sessionToken && !estaNaAreaDeAutenticacao) {
      router.replace('/(auth)/login');
      return;
    }

    if (sessionToken && estaNaAreaDeAutenticacao) {
      router.replace('/(tabs)');
    }
  }, [isHydrated, router, segments, sessionToken]);

  useEffect(() => {
    return configurarNotificacoes((petId) => {
      if (petId) {
        router.push({ pathname: '/pet/[id]', params: { id: petId } });
      }
    });
  }, [router]);

  if (!isHydrated) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
      </SafeAreaView>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GluestackUIProvider>
        <AppNavigator />
      </GluestackUIProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
