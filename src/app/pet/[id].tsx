import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { WalkRegistration } from '../../components/walk-registration';
import { WalkTimer } from '../../components/walk-timer';
import { useTheme } from '../../context/theme-context';
import {
  listarSessoesPasseio,
  salvarSessaoPasseio,
  type PasseioLog,
} from '../../services/passeio-db';
import { agendarLembretePasseio } from '../../services/notifications';
import { usePetStore } from '../../store/use-pet-store';
import {
  type Pet,
  type StatusPasseio,
  rotuloEspecie,
  rotuloStatusPasseio,
} from '../../types/pet';
import type { ThemeColors } from '../../theme';

function corDoStatus(status: StatusPasseio, colors: ThemeColors): string {
  switch (status) {
    case 'pendente':
      return colors.warning;
    case 'concluido':
      return colors.success;
    case 'cancelado':
      return colors.danger;
  }
}

function formatarData(dataIso: string): string {
  const data = new Date(dataIso);

  if (Number.isNaN(data.getTime())) {
    return 'Data indisponível';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data);
}

function formatarDuracao(totalSeconds: number): string {
  const minutos = Math.floor(totalSeconds / 60);
  const segundos = totalSeconds % 60;
  return minutos + ' min ' + segundos.toString().padStart(2, '0') + ' s';
}

export default function TelaDetalhePet() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const pet = usePetStore((state) => state.pets.find((item) => item.id === id));
  const isLoading = usePetStore((state) => state.isLoading);
  const fetchPets = usePetStore((state) => state.fetchPets);
  const togglePasseio = usePetStore((state) => state.togglePasseio);
  const registrarPasseio = usePetStore((state) => state.registrarPasseio);
  const removePet = usePetStore((state) => state.removePet);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [historico, setHistorico] = useState<PasseioLog[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    if (!pet) {
      void fetchPets().catch(() => undefined);
    }
  }, [fetchPets, pet]);

  useEffect(() => {
    let telaAtiva = true;

    async function carregarHistorico() {
      if (!pet) {
        return;
      }

      try {
        const sessoes = await listarSessoesPasseio(pet.id);
        if (telaAtiva) {
          setHistorico(sessoes);
        }
      } catch {
        if (telaAtiva) {
          setMensagem('O histórico local estará disponível após a primeira sessão.');
        }
      }
    }

    void carregarHistorico();

    return () => {
      telaAtiva = false;
    };
  }, [pet]);

  async function registrarDuracao(seconds: number) {
    if (!pet) {
      return;
    }

    await salvarSessaoPasseio(pet.id, seconds);
    const sessoes = await listarSessoesPasseio(pet.id);
    setHistorico(sessoes);
  }

  async function alternarStatus() {
    if (!pet || ocupado) {
      return;
    }

    try {
      setOcupado(true);
      await togglePasseio(pet.id);
      setMensagem('Status do passeio atualizado.');
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Não foi possível atualizar o status.');
    } finally {
      setOcupado(false);
    }
  }

  async function salvarRegistro(local?: Pet['local'], fotoUri?: string) {
    if (!pet) {
      return;
    }

    await registrarPasseio(pet.id, local, fotoUri);
    setModoRegistro(false);
    setMensagem('Passeio registrado na rotina de ' + pet.nome + '.');
  }

  async function agendarLembrete() {
    if (!pet) {
      return;
    }

    try {
      await agendarLembretePasseio(pet.id, pet.nome);
      setMensagem('Lembrete agendado para os próximos 5 segundos.');
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Não foi possível agendar o lembrete.');
    }
  }

  function confirmarRemocao() {
    if (!pet) {
      return;
    }

    Alert.alert(
      'Excluir ' + pet.nome + '?',
      'Este pet será removido da sua conta.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            void excluirPet();
          },
        },
      ],
    );
  }

  async function excluirPet() {
    if (!pet) {
      return;
    }

    try {
      setOcupado(true);
      await removePet(pet.id);
      router.back();
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Não foi possível excluir este pet.');
    } finally {
      setOcupado(false);
    }
  }

  if (modoRegistro && pet) {
    return (
      <WalkRegistration
        pet={pet}
        onCancel={() => setModoRegistro(false)}
        onSave={salvarRegistro}
      />
    );
  }

  if (!pet) {
    return (
      <View style={[styles.estadoTela, { backgroundColor: colors.background }]}>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : (
          <>
            <Text style={[styles.estadoTitulo, { color: colors.text }]}>Pet não encontrado</Text>
            <Text style={[styles.estadoTexto, { color: colors.muted }]}>
              Volte à sua lista e atualize os dados da rotina.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar para meus pets"
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.botaoVoltar,
                { borderColor: colors.border, opacity: pressed ? 0.65 : 1 },
              ]}
            >
              <Text style={[styles.textoBotaoSecundario, { color: colors.text }]}>Voltar</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  const corStatus = corDoStatus(pet.statusPasseio, colors);

  return (
    <ScrollView
      contentContainerStyle={[styles.conteudo, { backgroundColor: colors.background }]}
      style={styles.tela}
    >
      <View style={styles.topo}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.voltar,
            { borderColor: colors.border, opacity: pressed ? 0.65 : 1 },
          ]}
        >
          <Text style={[styles.textoVoltar, { color: colors.text }]}>← Lista</Text>
        </Pressable>
        <Text style={[styles.sobrelinha, { color: colors.primary }]}>PRONTUÁRIO PET</Text>
      </View>

      <View
        style={[
          styles.hero,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {pet.fotoUri ? (
          <Image
            contentFit="cover"
            recyclingKey={pet.id}
            source={{ uri: pet.fotoUri }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatarVazio, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.inicial, { color: colors.primary }]}>{pet.nome.slice(0, 1)}</Text>
          </View>
        )}
        <View style={styles.dadosHero}>
          <Text style={[styles.nome, { color: colors.text }]}>{pet.nome}</Text>
          <Text style={[styles.meta, { color: colors.muted }]}>
            {rotuloEspecie(pet.especie)} · porte {pet.porte} · {pet.idadeMeses} meses
          </Text>
          <View style={[styles.badge, { backgroundColor: corStatus }]}>
            <Text style={[styles.textoBadge, { color: colors.background }]}>
              {rotuloStatusPasseio(pet.statusPasseio).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {mensagem ? (
        <View style={[styles.mensagem, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.mensagemTexto, { color: colors.text }]}>{mensagem}</Text>
        </View>
      ) : null}

      <View style={styles.gradeAcoes}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Alternar status do passeio"
          disabled={ocupado}
          onPress={() => {
            void alternarStatus();
          }}
          style={({ pressed }) => [
            styles.acao,
            {
              backgroundColor: colors.surface,
              borderColor: colors.warning,
              opacity: pressed || ocupado ? 0.65 : 1,
            },
          ]}
        >
          <Text style={[styles.acaoTitulo, { color: colors.warning }]}>Alternar status</Text>
          <Text style={[styles.acaoDescricao, { color: colors.muted }]}>Atualize o dia</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Registrar passeio"
          onPress={() => setModoRegistro(true)}
          style={({ pressed }) => [
            styles.acao,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              opacity: pressed ? 0.74 : 1,
            },
          ]}
        >
          <Text style={[styles.acaoTitulo, { color: colors.background }]}>Registrar</Text>
          <Text style={[styles.acaoDescricao, { color: colors.background }]}>GPS e foto</Text>
        </Pressable>
      </View>

      <View style={styles.gradeAcoes}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Agendar lembrete de passeio"
          onPress={() => {
            void agendarLembrete();
          }}
          style={({ pressed }) => [
            styles.acao,
            {
              backgroundColor: colors.surface,
              borderColor: colors.secondary,
              opacity: pressed ? 0.65 : 1,
            },
          ]}
        >
          <Text style={[styles.acaoTitulo, { color: colors.secondary }]}>Lembrete</Text>
          <Text style={[styles.acaoDescricao, { color: colors.muted }]}>Em 5 segundos</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Atualizar foto do pet"
          onPress={() => {
            router.push({ pathname: '/foto-do-pet', params: { petId: pet.id } });
          }}
          style={({ pressed }) => [
            styles.acao,
            {
              backgroundColor: colors.surface,
              borderColor: colors.accent,
              opacity: pressed ? 0.65 : 1,
            },
          ]}
        >
          <Text style={[styles.acaoTitulo, { color: colors.accent }]}>Nova foto</Text>
          <Text style={[styles.acaoDescricao, { color: colors.muted }]}>Perfil quadrado</Text>
        </Pressable>
      </View>

      {pet.local ? (
        <View
          style={[
            styles.cartao,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.rotulo, { color: colors.primary }]}>ÚLTIMA LOCALIZAÇÃO</Text>
          <Text style={[styles.localizacao, { color: colors.text }]}>
            {pet.local.latitude.toFixed(4)}, {pet.local.longitude.toFixed(4)}
          </Text>
          <Text style={[styles.meta, { color: colors.muted }]}>
            Precisão aproximada: ±{Math.round(pet.local.precisaoMetros)} m
          </Text>
        </View>
      ) : null}

      <WalkTimer onSave={registrarDuracao} />

      <View
        style={[
          styles.cartao,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cabecalhoHistorico}>
          <Text style={[styles.rotulo, { color: colors.accent }]}>HISTÓRICO LOCAL</Text>
          <Text style={[styles.contador, { color: colors.muted }]}>{historico.length} sessões</Text>
        </View>
        {historico.length === 0 ? (
          <Text style={[styles.meta, { color: colors.muted }]}>
            Nenhuma duração foi salva para este pet.
          </Text>
        ) : (
          <View style={styles.listaHistorico}>
            {historico.map((sessao) => (
              <View key={sessao.id} style={[styles.linhaHistorico, { borderColor: colors.border }]}>
                <Text style={[styles.duracaoHistorico, { color: colors.text }]}>
                  {formatarDuracao(sessao.seconds)}
                </Text>
                <Text style={[styles.dataHistorico, { color: colors.muted }]}>
                  {formatarData(sessao.createdAt)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Excluir pet"
        disabled={ocupado}
        onPress={confirmarRemocao}
        style={({ pressed }) => [
          styles.excluir,
          {
            borderColor: colors.danger,
            opacity: pressed || ocupado ? 0.58 : 1,
          },
        ]}
      >
        <Text style={[styles.textoExcluir, { color: colors.danger }]}>Excluir pet</Text>
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
  estadoTela: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  estadoTitulo: {
    fontSize: 22,
    fontWeight: '900',
  },
  estadoTexto: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  botaoVoltar: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 130,
    padding: 13,
  },
  topo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voltar: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textoVoltar: {
    fontSize: 12,
    fontWeight: '800',
  },
  sobrelinha: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  hero: {
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 18,
    boxShadow: '0 0 22px rgba(53, 233, 255, 0.16)',
  },
  avatar: {
    borderRadius: 16,
    height: 104,
    width: 104,
  },
  avatarVazio: {
    alignItems: 'center',
    borderRadius: 16,
    height: 104,
    justifyContent: 'center',
    width: 104,
  },
  inicial: {
    fontSize: 48,
    fontWeight: '900',
  },
  dadosHero: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 27,
    fontWeight: '900',
  },
  meta: {
    fontSize: 13,
    lineHeight: 19,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  textoBadge: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  mensagem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 13,
  },
  mensagemTexto: {
    fontSize: 13,
    lineHeight: 19,
  },
  gradeAcoes: {
    flexDirection: 'row',
    gap: 10,
  },
  acao: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    gap: 5,
    padding: 15,
  },
  acaoTitulo: {
    fontSize: 14,
    fontWeight: '900',
  },
  acaoDescricao: {
    fontSize: 12,
    lineHeight: 17,
  },
  cartao: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 11,
    padding: 18,
    boxShadow: '0 0 18px rgba(252, 78, 255, 0.10)',
  },
  rotulo: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  localizacao: {
    fontSize: 16,
    fontWeight: '800',
  },
  cabecalhoHistorico: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contador: {
    fontSize: 12,
    fontWeight: '700',
  },
  listaHistorico: {
    gap: 1,
  },
  linhaHistorico: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  duracaoHistorico: {
    fontSize: 14,
    fontWeight: '800',
  },
  dataHistorico: {
    fontSize: 12,
  },
  excluir: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  textoExcluir: {
    fontSize: 14,
    fontWeight: '900',
  },
  textoBotaoSecundario: {
    fontSize: 13,
    fontWeight: '800',
  },
});
