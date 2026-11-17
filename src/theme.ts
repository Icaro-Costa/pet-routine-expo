/** Shared design tokens for the neon/cyberpunk visual system. */
export const espaco = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const raio = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const tipografia = {
  overline: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.4 },
  etiqueta: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.1 },
  titulo: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  subtitulo: { fontSize: 19, fontWeight: '700' as const },
  corpo: { fontSize: 16, fontWeight: '400' as const, lineHeight: 23 },
  legenda: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  botao: { fontSize: 15, fontWeight: '800' as const, letterSpacing: 0.2 },
} as const;

const darkColors = {
  background: '#080A16',
  surface: '#10142A',
  surfaceAlt: '#171C38',
  surfaceMuted: '#20274A',
  text: '#F7F7FF',
  muted: '#A8B2D8',
  textMuted: '#A8B2D8',
  primary: '#35E9FF',
  onPrimary: '#04131A',
  secondary: '#FC4EFF',
  onSecondary: '#FFFFFF',
  accent: '#A6FF4D',
  success: '#60F6A6',
  onSuccess: '#042216',
  warning: '#FFC857',
  danger: '#FF5C8A',
  border: '#303A68',
  input: '#0D1022',
  overlay: 'rgba(4, 5, 18, 0.78)',
  shadow: '#000000',
  glow: 'rgba(53, 233, 255, 0.42)',
} as const;

const lightColors = {
  background: '#F3F7FF',
  surface: '#FFFFFF',
  surfaceAlt: '#E7EFFF',
  surfaceMuted: '#D5E3FF',
  text: '#11162D',
  muted: '#566384',
  textMuted: '#566384',
  primary: '#007C9B',
  onPrimary: '#FFFFFF',
  secondary: '#AF168E',
  onSecondary: '#FFFFFF',
  accent: '#4B861D',
  success: '#087C49',
  onSuccess: '#FFFFFF',
  warning: '#9A6500',
  danger: '#BE2455',
  border: '#B8C7ED',
  input: '#F8FAFF',
  overlay: 'rgba(17, 22, 45, 0.42)',
  shadow: '#101427',
  glow: 'rgba(0, 124, 155, 0.22)',
} as const;

export type ThemeMode = 'dark' | 'light';
export type ThemeColors = Record<keyof typeof darkColors, string>;

export const themes: Record<ThemeMode, ThemeColors> = {
  dark: darkColors,
  light: lightColors,
};

/**
 * Backward-compatible Portuguese aliases for small reusable components.
 * New screens should consume `useTheme().colors` so the selected mode is honored.
 */
export const cores = {
  fundo: darkColors.background,
  fundoElevado: darkColors.surfaceAlt,
  cartao: darkColors.surface,
  texto: darkColors.text,
  textoFraco: darkColors.textMuted,
  primaria: darkColors.primary,
  secundaria: darkColors.secondary,
  destaque: darkColors.accent,
  sucesso: darkColors.success,
  aviso: darkColors.warning,
  erro: darkColors.danger,
  borda: darkColors.border,
} as const;
