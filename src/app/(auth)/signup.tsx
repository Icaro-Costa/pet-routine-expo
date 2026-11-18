import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../../context/theme-context';
import { signupUser } from '../../services/auth-service';

export default function SignupScreen() {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const camposInvalidos = name.trim() === '' || email.trim() === '' || password.trim().length < 6;

  async function handleSignup() {
    if (camposInvalidos || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      await signupUser(name.trim(), email.trim(), password);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível criar a conta.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.glowOrb, styles.glowOne, { backgroundColor: colors.secondary }]} />
      <View style={styles.content}>
        <View style={styles.heading}>
          <View style={[styles.iconShell, { backgroundColor: colors.surface, borderColor: colors.secondary, boxShadow: `0 0 18px ${colors.glow}` }]}>
            <Feather color={colors.secondary} name="cpu" size={25} />
          </View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>NOVA IDENTIDADE</Text>
          <Text style={[styles.title, { color: colors.text }]}>Conecte sua{`\n`}matilha.</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Crie o seu perfil para começar a organizar cada rotina.</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, boxShadow: `0 10px 30px ${colors.glow}` }]}>
          <Field
            colors={colors}
            icon="user"
            label="SEU NOME"
            onChangeText={setName}
            placeholder="Como podemos te chamar?"
            value={name}
          />
          <Field
            autoCapitalize="none"
            autoComplete="email"
            colors={colors}
            icon="mail"
            keyboardType="email-address"
            label="E-MAIL"
            onChangeText={setEmail}
            placeholder="voce@exemplo.com"
            value={email}
          />
          <Field
            autoComplete="new-password"
            colors={colors}
            icon="lock"
            label="SENHA"
            onChangeText={setPassword}
            placeholder="Ao menos 6 caracteres"
            secureTextEntry
            value={password}
          />

          {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

          <Pressable
            accessibilityLabel="Criar conta"
            accessibilityRole="button"
            disabled={camposInvalidos || isLoading}
            onPress={handleSignup}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.secondary, opacity: camposInvalidos || isLoading ? 0.5 : pressed ? 0.82 : 1 },
            ]}
          >
            {isLoading ? <ActivityIndicator color={colors.background} /> : <Text style={[styles.primaryButtonText, { color: colors.background }]}>Criar minha conta</Text>}
          </Pressable>
        </View>

        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Já tem acesso?{' '}
          <Link href="/(auth)/login" style={[styles.footerLink, { color: colors.primary }]}>Entrar</Link>
        </Text>
      </View>
    </View>
  );
}

type FieldProps = {
  autoCapitalize?: 'none';
  autoComplete?: 'email' | 'new-password';
  colors: {
    border: string;
    input: string;
    secondary: string;
    text: string;
    textMuted: string;
  };
  icon: keyof typeof Feather.glyphMap;
  keyboardType?: 'email-address';
  label: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
};

function Field({ autoCapitalize, autoComplete, colors, icon, keyboardType, label, onChangeText, placeholder, secureTextEntry, value }: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <View style={[styles.inputShell, { backgroundColor: colors.input, borderColor: colors.border }]}>
        <Feather color={colors.secondary} name={icon} size={18} />
        <TextInput
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          style={[styles.input, { color: colors.text }]}
          value={value}
        />
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
  glowOrb: {
    borderRadius: 999,
    height: 290,
    opacity: 0.1,
    position: 'absolute',
    width: 290,
  },
  glowOne: {
    right: -110,
    top: -120,
  },
  content: {
    alignSelf: 'center',
    gap: 24,
    maxWidth: 520,
    width: '100%',
  },
  heading: {
    gap: 8,
  },
  iconShell: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    fontSize: 33,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
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
