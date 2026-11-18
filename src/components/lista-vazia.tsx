import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/theme-context';
import { espaco, tipografia } from '../theme';
import { NeonCard } from './cyber-ui';

type ListaVaziaProps = {
  termoBusca: string;
};

export function ListaVazia({ termoBusca }: ListaVaziaProps) {
  const { colors } = useTheme();
  const searching = termoBusca.trim().length > 0;

  return (
    <NeonCard accent="accent" style={styles.card}>
      <Feather color={colors.accent} name={searching ? 'search' : 'heart'} size={28} />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>
          {searching ? 'Nenhum sinal encontrado' : 'Sua base pet está vazia'}
        </Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          {searching
            ? `Não há pets com “${termoBusca.trim()}”. Tente outro nome.`
            : 'Cadastre seu primeiro companheiro para iniciar a rotina.'}
        </Text>
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: espaco.xl,
  },
  copy: {
    alignItems: 'center',
    gap: espaco.xs,
  },
  title: {
    ...tipografia.subtitulo,
    textAlign: 'center',
  },
  body: {
    ...tipografia.corpo,
    textAlign: 'center',
  },
});
