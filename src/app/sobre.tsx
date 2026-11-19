import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '../context/theme-context';

const PILARES = [
  ['ROTAS', 'Expo Router organiza as áreas públicas, privadas e os detalhes de cada pet.'],
  ['DADOS', 'Zustand, AsyncStorage e SQLite mantêm sessão, estado e histórico próximos do tutor.'],
  ['REDE', 'A API Express protegida por JWT centraliza a conta e o CRUD de pets.'],
];

export default function TelaSobre() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={[styles.conteudo, { backgroundColor: colors.background }]}
      style={styles.tela}
    >
      <View style={styles.hero}>
        <Text style={[styles.sobrelinha, { color: colors.secondary }]}>PET ROUTINE / 1.0.0</Text>
        <Text style={[styles.titulo, { color: colors.text }]}>Rotina pet{'\n'}em outro nível.</Text>
        <Text style={[styles.descricao, { color: colors.muted }]}>
          Um painel cyberpunk para tutores registrarem companheiros, passeios e
          lembretes com privacidade.
        </Text>
      </View>

      <View
        style={[
          styles.cartao,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primary,
          },
        ]}
      >
        <Text style={[styles.rotulo, { color: colors.primary }]}>EQUIPE</Text>
        <Text style={[styles.textoCartao, { color: colors.text }]}>
          Projeto acadêmico desenvolvido para Desenvolvimento Mobile — CESAR School.
        </Text>
        <Text style={[styles.legenda, { color: colors.muted }]}>
          Inclua os integrantes do grupo antes da entrega final.
        </Text>
      </View>

      <View style={styles.pilares}>
        {PILARES.map(([titulo, descricao]) => (
          <View
            key={titulo}
            style={[
              styles.cartao,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.rotulo, { color: colors.accent }]}>{titulo}</Text>
            <Text style={[styles.textoCartao, { color: colors.text }]}>{descricao}</Text>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.botao,
          {
            borderColor: colors.border,
            opacity: pressed ? 0.65 : 1,
          },
        ]}
      >
        <Text style={[styles.textoBotao, { color: colors.text }]}>Voltar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    flexGrow: 1,
    gap: 16,
    padding: 20,
  },
  hero: {
    gap: 9,
    paddingVertical: 12,
  },
  sobrelinha: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  titulo: {
    fontSize: 33,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 38,
  },
  descricao: {
    fontSize: 15,
    lineHeight: 22,
  },
  pilares: {
    gap: 12,
  },
  cartao: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 9,
    padding: 18,
    boxShadow: '0 0 18px rgba(0, 245, 255, 0.12)',
  },
  rotulo: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  textoCartao: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  legenda: {
    fontSize: 12,
    lineHeight: 18,
  },
  botao: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  textoBotao: {
    fontSize: 14,
    fontWeight: '800',
  },
});
