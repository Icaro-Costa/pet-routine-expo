import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../../context/theme-context';
import { loginUser } from '../../services/auth-service';

const EMAIL_DEMONSTRACAO = 'tutor@cesar.school';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState(EMAIL_DEMONSTRACAO);
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const camposInvalidos = email.trim() === '' || password.trim() === '';

  async function handleLogin() {
    if (camposInvalidos || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      await loginUser(email.trim(), password);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível iniciar sua sessão.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.glowOrb, styles.glowOne, { backgroundColor: colors.primary }]} />
      <View style={[styles.glowOrb, styles.glowTwo, { backgroundColor: colors.secondary }]} />

      <View style={styles.content}>
        <View style={styles.brandBlock}>
          <View style={[styles.brandMark, { backgroundColor: colors.surface, borderColor: colors.primary, boxShadow: `0 0 18px ${colors.glow}` }]}> 
            <Feather color={colors.primary} name="zap" size={28} />
          </View>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>PET ROUTINE // 2077</Text>
          <Text style={[styles.title, { color: colors.text }]}>Sua matilha,{`\n`}sincronizada.</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Acesse o painel de rotina e mantenha cada passeio no radar.</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, boxShadow: `0 10px 30px ${colors.glow}` }]}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>E-MAIL</Text>
            <View style={[styles.inputShell, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Feather color={colors.secondary} name="mail" size={18} />
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="voce@exemplo.com"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.text }]}
                value={email}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>SENHA</Text>
            <View style={[styles.inputShell, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Feather color={colors.secondary} name="lock" size={18} />
              <TextInput
                autoComplete="current-password"
                onChangeText={setPassword}
                placeholder="Sua senha"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                style={[styles.input, { color: colors.text }]}
                value={password}
              />
            </View>
          </View>

          {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

          <Pressable
            accessibilityLabel="Entrar na conta"
            accessibilityRole="button"
            disabled={camposInvalidos || isLoading}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.primary, opacity: camposInvalidos || isLoading ? 0.5 : pressed ? 0.82 : 1 },
            ]}
          >
            {isLoading ? <ActivityIndicator color={colors.background} /> : <Text style={[styles.primaryButtonText, { color: colors.background }]}>Entrar no painel</Text>}
          </Pressable>
        </View>

        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Ainda não faz parte da rede?{' '}
          <Link href="/(auth)/signup" style={[styles.footerLink, { color: colors.primary }]}>Criar conta</Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 24,
  },
  content: {
    gap: 28,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  glowOrb: {
    borderRadius: 999,
    height: 260,
    opacity: 0.1,
    position: 'absolute',
    width: 260,
  },
  glowOne: {
    right: -110,
    top: -70,
  },
  glowTwo: {
    bottom: -125,
    left: -120,
  },
  brandBlock: {
    gap: 10,
  },
  brandMark: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 390,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 18,
    padding: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  inputShell: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 48,
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  footerText: {
    alignSelf: 'center',
    fontSize: 14,
    textAlign: 'center',
  },
  footerLink: {
    fontWeight: '800',
  },
});
