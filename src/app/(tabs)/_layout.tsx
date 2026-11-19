import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useTheme } from '../../context/theme-context';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 66,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Meus pets',
          tabBarIcon: ({ color, size }) => <Feather color={color} name="heart" size={size} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Feather color={color} name="activity" size={size} />,
        }}
      />
    </Tabs>
  );
}
