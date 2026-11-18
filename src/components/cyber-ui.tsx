import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, View, type ViewStyle } from 'react-native';

import { useTheme } from '../context/theme-context';
import { espaco, raio, tipografia } from '../theme';
import { Button } from './ui/button';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, style }: ScreenProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }, style]}>
      <View pointerEvents="none" style={[styles.grid, { borderColor: colors.border }]} />
      {children}
    </View>
  );
}

type NeonCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: 'primary' | 'secondary' | 'accent';
};

export function NeonCard({ children, style, accent = 'primary' }: NeonCardProps) {
  const { colors } = useTheme();
  const accentColor = colors[accent];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: accentColor,
          boxShadow: `0 0 22px ${colors.glow}`,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

type NeonButtonProps = {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  accessibilityLabel?: string;
};

export function NeonButton({
  children,
  onPress,
  disabled = false,
  variant = 'primary',
  accessibilityLabel,
}: NeonButtonProps) {
  const { colors } = useTheme();
  const isGhost = variant === 'ghost';
  const fill = variant === 'danger' ? colors.danger : variant === 'secondary' ? colors.secondary : colors.primary;
  const textColor = isGhost ? colors.text : colors.background;

  return (
    <Button
      className="items-center justify-center"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      isDisabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isGhost ? colors.surfaceAlt : fill,
          borderColor: isGhost ? colors.border : fill,
          opacity: disabled ? 0.45 : pressed ? 0.78 : 1,
          boxShadow: isGhost ? undefined : `0 0 16px ${colors.glow}`,
        },
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.buttonText, { color: textColor }]}>{children}</Text>
      ) : (
        <View style={styles.buttonContent}>{children}</View>
      )}
    </Button>
  );
}

type StatusPillProps = {
  children: ReactNode;
  tone?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted';
};

export function StatusPill({ children, tone = 'primary' }: StatusPillProps) {
  const { colors } = useTheme();
  const backgroundColor = tone === 'muted' ? colors.surfaceMuted : colors[tone];
  const color = tone === 'muted' ? colors.textMuted : colors.background;

  return (
    <View style={[styles.pill, { backgroundColor, borderColor: backgroundColor }]}>
      <Text style={[styles.pillText, { color }]}>{children}</Text>
    </View>
  );
}

type EyebrowProps = {
  children: ReactNode;
};

export function Eyebrow({ children }: EyebrowProps) {
  const { colors } = useTheme();

  return <Text style={[styles.eyebrow, { color: colors.secondary }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  grid: {
    ...StyleSheet.absoluteFill,
    opacity: 0.14,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: raio.lg,
    padding: espaco.md,
    gap: espaco.sm,
  },
  button: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: raio.md,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.sm,
  },
  buttonText: {
    ...tipografia.botao,
    textAlign: 'center',
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: espaco.sm,
  },
  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: raio.pill,
    paddingHorizontal: espaco.sm,
    paddingVertical: espaco.xs,
  },
  pillText: {
    ...tipografia.etiqueta,
  },
  eyebrow: {
    ...tipografia.etiqueta,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});
