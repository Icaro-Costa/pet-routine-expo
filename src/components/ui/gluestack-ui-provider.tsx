import type { ReactNode } from 'react';
import { View } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { useTheme } from '../../context/theme-context';

export function GluestackUIProvider({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();
  return (
    <View className={isDark ? 'dark flex-1' : 'flex-1'}>
      <OverlayProvider>
        <ToastProvider>{children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
