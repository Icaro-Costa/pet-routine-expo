import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { NativePetReminderSettings } from '../../components/native-pet-reminder-settings';
import { OtaStatusCard } from '../../components/ota-status-card';
import { useTheme } from '../../context/theme-context';
import { logoutUser } from '../../services/auth-service';
import { useAuthStore } from '../../store/use-auth-store';
import { usePetStore } from '../../store/use-pet-store';

type MetricProps = {
  color: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  mutedColor: string;
  value: string;
};

function Metric({ color, icon, label, mutedColor, value }: MetricProps) {
  return (
    <View style={[styles.metric, { borderColor: color }]}>
      <Feather color={color} name={icon} size={18} />
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: mutedColor }]}>{label}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const pets = usePetStore((state) => state.pets);
  const fetchPets = usePetStore((state) => state.fetchPets);
  const isLoading = usePetStore((state) => state.isLoading);
  const fetchError = usePetStore((state) => state.error);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  useEffect(() => {
    if (pets.length === 0) {
      void fetchPets().catch(() => undefined);
    }
  }, [fetchPets, pets.length]);

  const metrics = useMemo(() => {
    const concluidos = pets.filter((pet) => pet.statusPasseio === 'concluido').length;
    const pendentes = pets.filter((pet) => pet.statusPasseio === 'pendente').length;
    const cancelados = pets.filter((pet) => pet.statusPasseio === 'cancelado').length;
    const percentual = pets.length === 0 ? 0 : Math.round((concluidos / pets.length) * 100);

    return { cancelados, concluidos, pendentes, percentual };
  }, [pets]);

  async function handleLogout() {
    if (isLoggingOut) return;

    setLogoutError(null);
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch (caughtError) {
      setLogoutError(caughtError instanceof Error ? caughtError.message : 'Não foi possível encerrar sua sessão.');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.secondary }]}>PAINEL DA MATILHA</Text>
        <Text style={[styles.title, { color: colors.text }]}>Olá, {user?.name ?? 'tutor'}.</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Um resumo da rotina que está acontecendo agora.</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border, boxShadow: `0 8px 22px ${colors.glow}` }]}>
        <View style={[styles.avatar, { backgroundColor: colors.input, borderColor: colors.primary }]}>
          <Feather color={colors.primary} name="user" size={22} />
        </View>
        <View style={styles.profileText}>
          <Text style={[styles.profileName, { color: colors.text }]}>{user?.name ?? 'Tutor Pet'}</Text>
          <Text style={[styles.profileEmail, { color: colors.textMuted }]}>{user?.email ?? 'sessão protegida'}</Text>
        </View>
        <View style={[styles.onlineChip, { backgroundColor: colors.success }]}>
          <Text style={[styles.onlineText, { color: colors.background }]}>ONLINE</Text>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sinal da rotina</Text>
        {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      </View>

      <View style={styles.metricsGrid}>
        <Metric color={colors.primary} icon="heart" label="pets" mutedColor={colors.textMuted} value={String(pets.length)} />
        <Metric color={colors.success} icon="check-circle" label="concluídos" mutedColor={colors.textMuted} value={String(metrics.concluidos)} />
        <Metric color={colors.warning} icon="clock" label="pendentes" mutedColor={colors.textMuted} value={String(metrics.pendentes)} />
        <Metric color={colors.secondary} icon="trending-up" label="hoje" mutedColor={colors.textMuted} value={`${metrics.percentual}%`} />
      </View>

      {fetchError ? <Text style={[styles.fetchError, { color: colors.danger }]}>{fetchError}</Text> : null}

      {metrics.cancelados > 0 ? (
        <Text style={[styles.cancelledHint, { color: colors.textMuted }]}>{metrics.cancelados} passeio(s) cancelado(s) hoje.</Text>
      ) : null}

      <View style={[styles.preferenceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.preferenceCopy}>
          <Text style={[styles.preferenceTitle, { color: colors.text }]}>Visão noturna</Text>
          <Text style={[styles.preferenceText, { color: colors.textMuted }]}>Alterna a interface entre os dois modos de contraste.</Text>
        </View>
        <Switch
          onValueChange={toggleTheme}
          thumbColor={isDark ? colors.primary : colors.surface}
          trackColor={{ false: colors.border, true: colors.secondary }}
          value={isDark}
        />
      </View>

      <NativePetReminderSettings />
      <OtaStatusCard />
      <Link href="/sobre" style={{ color: colors.primary }}>Sobre o projeto</Link>

      {logoutError ? <Text style={[styles.logoutError, { color: colors.danger }]}>{logoutError}</Text> : null}
      <Pressable
        accessibilityLabel="Sair da conta"
        accessibilityRole="button"
        disabled={isLoggingOut}
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          { borderColor: colors.danger, opacity: isLoggingOut ? 0.55 : pressed ? 0.75 : 1 },
        ]}
      >
        {isLoggingOut ? <ActivityIndicator color={colors.danger} /> : <Feather color={colors.danger} name="log-out" size={18} />}
        <Text style={[styles.logoutText, { color: colors.danger }]}>{isLoggingOut ? 'Encerrando sessão...' : 'Sair da conta'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 34,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  profileText: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 13,
  },
  onlineChip: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  onlineText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metric: {
    borderLeftWidth: 2,
    flexBasis: '47%',
    flexGrow: 1,
    gap: 3,
    minHeight: 108,
    padding: 14,
  },
  metricValue: {
    fontSize: 27,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cancelledHint: {
    fontSize: 13,
  },
  fetchError: {
    fontSize: 13,
    lineHeight: 19,
  },
  preferenceCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  preferenceCopy: {
    flex: 1,
    gap: 3,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  preferenceText: {
    fontSize: 13,
    lineHeight: 19,
  },
  logoutError: {
    fontSize: 13,
    lineHeight: 19,
  },
  logoutButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 18,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
