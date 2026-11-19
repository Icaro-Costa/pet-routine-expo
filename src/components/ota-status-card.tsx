import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Updates from 'expo-updates';

import { useTheme } from '../context/theme-context';

function mensagemDoErro(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Não foi possível consultar atualizações agora.';
}

export function OtaStatusCard() {
  const { colors } = useTheme();
  const { currentlyRunning, isChecking, isDownloading } = Updates.useUpdates();
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function buscarAtualizacao() {
    if (__DEV__) {
      setMensagem('OTA desabilitado em modo de desenvolvimento.');
      return;
    }

    try {
      setMensagem(null);
      const resultado = await Updates.checkForUpdateAsync();

      if (!resultado.isAvailable) {
        setMensagem('Seu app já está no sinal mais recente.');
        return;
      }

      await Updates.fetchUpdateAsync();
      setMensagem('Atualização baixada. Reiniciando o app…');
      await Updates.reloadAsync();
    } catch (error) {
      setMensagem(mensagemDoErro(error));
    }
  }

  const atualizando = isChecking || isDownloading;

  return (
    <View
      style={[
        styles.cartao,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.cabecalho}>
        <View style={[styles.ponto, { backgroundColor: colors.accent }]} />
        <View style={styles.titulos}>
          <Text style={[styles.sobrelinha, { color: colors.accent }]}>REDE / OTA</Text>
          <Text style={[styles.titulo, { color: colors.text }]}>Canal de atualização</Text>
        </View>
      </View>

      <View style={styles.linhas}>
        <Text style={[styles.linha, { color: colors.muted }]}>
          Canal: {currentlyRunning.channel ?? 'não configurado'}
        </Text>
        <Text style={[styles.linha, { color: colors.muted }]}>
          Runtime: {currentlyRunning.runtimeVersion ?? 'desenvolvimento'}
        </Text>
      </View>

      {mensagem ? (
        <Text style={[styles.mensagem, { color: colors.text }]}>{mensagem}</Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Buscar atualização OTA"
        disabled={atualizando}
        onPress={() => {
          void buscarAtualizacao();
        }}
        style={({ pressed }) => [
          styles.botao,
          {
            backgroundColor: colors.accent,
            opacity: pressed || atualizando ? 0.72 : 1,
          },
        ]}
      >
        {atualizando ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={[styles.textoBotao, { color: colors.background }]}>
            Buscar atualização OTA
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    boxShadow: '0 0 18px rgba(184, 255, 0, 0.14)',
  },
  cabecalho: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  ponto: {
    borderRadius: 8,
    height: 12,
    width: 12,
  },
  titulos: {
    gap: 2,
  },
  sobrelinha: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  titulo: {
    fontSize: 17,
    fontWeight: '800',
  },
  linhas: {
    gap: 4,
  },
  linha: {
    fontSize: 13,
  },
  mensagem: {
    fontSize: 13,
    lineHeight: 19,
  },
  botao: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
  },
  textoBotao: {
    fontSize: 14,
    fontWeight: '800',
  },
});
