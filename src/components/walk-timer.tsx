import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/theme-context';

type WalkTimerProps = {
  onSave: (seconds: number) => Promise<void> | void;
};

function formatarDuracao(totalSeconds: number): string {
  const horas = Math.floor(totalSeconds / 3600);
  const minutos = Math.floor((totalSeconds % 3600) / 60);
  const segundos = totalSeconds % 60;

  return [horas, minutos, segundos]
    .map((unidade) => unidade.toString().padStart(2, '0'))
    .join(':');
}

export function WalkTimer({ onSave }: WalkTimerProps) {
  const { colors } = useTheme();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  async function salvar() {
    if (seconds === 0 || salvando) {
      return;
    }

    try {
      setSalvando(true);
      await onSave(seconds);
      setMensagem('Sessão salva no histórico local.');
      setSeconds(0);
      setIsRunning(false);
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar esta sessão.',
      );
    } finally {
      setSalvando(false);
    }
  }

  function reiniciar() {
    setSeconds(0);
    setIsRunning(false);
    setMensagem(null);
  }

  return (
    <View
      style={[
        styles.cartao,
        {
          backgroundColor: colors.surface,
          borderColor: colors.primary,
        },
      ]}
    >
      <View style={styles.cabecalho}>
        <Text style={[styles.sobrelinha, { color: colors.primary }]}>CRONÔMETRO</Text>
        <View
          style={[
            styles.estado,
            {
              backgroundColor: isRunning ? colors.success : colors.surfaceAlt,
            },
          ]}
        >
          <Text style={[styles.estadoTexto, { color: isRunning ? colors.background : colors.muted }]}>
            {isRunning ? 'EM PASSEIO' : 'PRONTO'}
          </Text>
        </View>
      </View>

      <Text accessibilityLabel="Duração do passeio" style={[styles.tempo, { color: colors.text }]}>
        {formatarDuracao(seconds)}
      </Text>

      <View style={styles.acoes}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isRunning ? 'Pausar cronômetro' : 'Iniciar cronômetro'}
          onPress={() => setIsRunning((prev) => !prev)}
          style={({ pressed }) => [
            styles.botao,
            {
              backgroundColor: isRunning ? colors.warning : colors.primary,
              opacity: pressed ? 0.74 : 1,
            },
          ]}
        >
          <Text style={[styles.textoBotao, { color: colors.background }]}>
            {isRunning ? 'Pausar' : 'Iniciar'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reiniciar cronômetro"
          onPress={reiniciar}
          style={({ pressed }) => [
            styles.botaoSecundario,
            {
              borderColor: colors.border,
              opacity: pressed ? 0.65 : 1,
            },
          ]}
        >
          <Text style={[styles.textoSecundario, { color: colors.text }]}>Zerar</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Salvar duração do passeio"
          disabled={seconds === 0 || salvando}
          onPress={() => {
            void salvar();
          }}
          style={({ pressed }) => [
            styles.botaoSecundario,
            {
              borderColor: colors.secondary,
              opacity: pressed || seconds === 0 || salvando ? 0.55 : 1,
            },
          ]}
        >
          {salvando ? (
            <ActivityIndicator color={colors.secondary} />
          ) : (
            <Text style={[styles.textoSecundario, { color: colors.secondary }]}>Salvar</Text>
          )}
        </Pressable>
      </View>

      {mensagem ? (
        <Text style={[styles.mensagem, { color: colors.muted }]}>{mensagem}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    padding: 18,
    boxShadow: '0 0 20px rgba(0, 245, 255, 0.16)',
  },
  cabecalho: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sobrelinha: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  estado: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  estadoTexto: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  tempo: {
    fontSize: 40,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  acoes: {
    flexDirection: 'row',
    gap: 8,
  },
  botao: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1.25,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 10,
  },
  botaoSecundario: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 8,
  },
  textoBotao: {
    fontSize: 13,
    fontWeight: '900',
  },
  textoSecundario: {
    fontSize: 12,
    fontWeight: '800',
  },
  mensagem: {
    fontSize: 12,
    textAlign: 'center',
  },
});
