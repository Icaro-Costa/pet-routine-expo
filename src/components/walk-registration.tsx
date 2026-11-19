import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { useTheme } from '../context/theme-context';
import type { Pet } from '../types/pet';

type WalkRegistrationProps = {
  pet: Pet;
  onCancel: () => void;
  onSave: (local?: Pet['local'], fotoUri?: string) => Promise<void>;
};

function mensagemDePermissaoDaCamera(canAskAgain: boolean): string {
  return canAskAgain
    ? 'A câmera foi negada. Toque novamente para permitir o acesso.'
    : 'A câmera foi bloqueada. Habilite-a nas configurações do aparelho.';
}

export function WalkRegistration({ pet, onCancel, onSave }: WalkRegistrationProps) {
  const { colors } = useTheme();
  const [local, setLocal] = useState<Pet['local']>();
  const [fotoUri, setFotoUri] = useState<string>();
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [carregandoLocal, setCarregandoLocal] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function obterLocalizacao() {
    try {
      setCarregandoLocal(true);
      const servicoAtivo = await Location.hasServicesEnabledAsync();

      if (!servicoAtivo) {
        setMensagem('O GPS está desligado. Ative a localização e tente novamente.');
        return;
      }

      const permissao = await Location.requestForegroundPermissionsAsync();
      if (permissao.status !== 'granted') {
        setMensagem(
          permissao.canAskAgain
            ? 'A localização foi negada. Toque novamente para permitir o acesso.'
            : 'A localização foi bloqueada. Habilite-a nas configurações do aparelho.',
        );
        return;
      }

      const posicao = await Location.getCurrentPositionAsync({
        // Balanced equilibra precisão suficiente para passeios e consumo de bateria.
        accuracy: Location.Accuracy.Balanced,
      });

      setLocal({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        precisaoMetros: posicao.coords.accuracy ?? 0,
      });
      setMensagem(null);
    } catch {
      setMensagem('Não foi possível ler a localização deste aparelho.');
    } finally {
      setCarregandoLocal(false);
    }
  }

  async function escolherDaGaleria() {
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissao.status !== 'granted') {
        setMensagem(
          permissao.canAskAgain
            ? 'A galeria foi negada. Toque novamente para permitir o acesso.'
            : 'A galeria foi bloqueada. Habilite-a nas configurações do aparelho.',
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (resultado.canceled) {
        return;
      }

      setFotoUri(resultado.assets[0].uri);
      setMensagem(null);
    } catch {
      setMensagem('Não foi possível abrir a galeria agora.');
    }
  }

  async function tirarFoto() {
    try {
      const permissao = await ImagePicker.requestCameraPermissionsAsync();
      if (permissao.status !== 'granted') {
        setMensagem(mensagemDePermissaoDaCamera(permissao.canAskAgain));
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (resultado.canceled) {
        return;
      }

      setFotoUri(resultado.assets[0].uri);
      setMensagem(null);
    } catch {
      setMensagem('Não foi possível abrir a câmera agora.');
    }
  }

  async function salvarRegistro() {
    try {
      setSalvando(true);
      await onSave(local, fotoUri);
    } catch (error) {
      setMensagem(
        error instanceof Error ? error.message : 'Não foi possível registrar o passeio.',
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.conteudo, { backgroundColor: colors.background }]}
      style={styles.tela}
    >
      <View style={styles.cabecalho}>
        <Text style={[styles.sobrelinha, { color: colors.primary }]}>REGISTRO DE ROTA</Text>
        <Text style={[styles.titulo, { color: colors.text }]}>Passeio de {pet.nome}</Text>
        <Text style={[styles.descricao, { color: colors.muted }]}>
          Salve sensores e uma imagem opcional para completar o passeio.
        </Text>
      </View>

      {mensagem ? (
        <View style={[styles.alerta, { backgroundColor: colors.surfaceAlt, borderColor: colors.warning }]}>
          <Text style={[styles.alertaTexto, { color: colors.text }]}>{mensagem}</Text>
        </View>
      ) : null}

      <View
        style={[
          styles.cartao,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.rotulo, { color: colors.text }]}>COORDENADAS</Text>
        {local ? (
          <View style={styles.dados}>
            <Text style={[styles.dadoPrincipal, { color: colors.text }]}>
              {local.latitude.toFixed(4)}, {local.longitude.toFixed(4)}
            </Text>
            <Text style={[styles.dadoSecundario, { color: colors.muted }]}>
              Precisão aproximada: ±{Math.round(local.precisaoMetros)} m
            </Text>
          </View>
        ) : (
          <Text style={[styles.dadoSecundario, { color: colors.muted }]}>
            Nenhuma posição registrada ainda.
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Obter localização"
          disabled={carregandoLocal}
          onPress={() => {
            void obterLocalizacao();
          }}
          style={({ pressed }) => [
            styles.botaoSecundario,
            {
              borderColor: colors.primary,
              opacity: pressed || carregandoLocal ? 0.65 : 1,
            },
          ]}
        >
          {carregandoLocal ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={[styles.textoBotaoSecundario, { color: colors.primary }]}>
              Obter localização
            </Text>
          )}
        </Pressable>
      </View>

      <View
        style={[
          styles.cartao,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.rotulo, { color: colors.text }]}>CAPTURA VISUAL</Text>
        {fotoUri ? (
          <Image
            contentFit="cover"
            source={{ uri: fotoUri }}
            style={styles.previa}
          />
        ) : (
          <View style={[styles.previaVazia, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.dadoSecundario, { color: colors.muted }]}>
              Sem foto neste registro
            </Text>
          </View>
        )}
        <View style={styles.acoesFoto}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tirar foto para o passeio"
            onPress={() => {
              void tirarFoto();
            }}
            style={({ pressed }) => [
              styles.botaoSecundario,
              { borderColor: colors.secondary, opacity: pressed ? 0.65 : 1 },
            ]}
          >
            <Text style={[styles.textoBotaoSecundario, { color: colors.secondary }]}>
              Tirar foto
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Escolher foto da galeria"
            onPress={() => {
              void escolherDaGaleria();
            }}
            style={({ pressed }) => [
              styles.botaoSecundario,
              { borderColor: colors.accent, opacity: pressed ? 0.65 : 1 },
            ]}
          >
            <Text style={[styles.textoBotaoSecundario, { color: colors.accent }]}>
              Galeria
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.acoesFinais}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancelar registro de passeio"
          disabled={salvando}
          onPress={onCancel}
          style={({ pressed }) => [
            styles.cancelar,
            {
              borderColor: colors.border,
              opacity: pressed || salvando ? 0.65 : 1,
            },
          ]}
        >
          <Text style={[styles.textoBotaoSecundario, { color: colors.text }]}>Cancelar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Salvar registro de passeio"
          disabled={salvando}
          onPress={() => {
            void salvarRegistro();
          }}
          style={({ pressed }) => [
            styles.salvar,
            {
              backgroundColor: colors.primary,
              opacity: pressed || salvando ? 0.65 : 1,
            },
          ]}
        >
          {salvando ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.textoSalvar, { color: colors.background }]}>Concluir passeio</Text>
          )}
        </Pressable>
      </View>
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
  cabecalho: {
    gap: 6,
  },
  sobrelinha: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '900',
  },
  descricao: {
    fontSize: 14,
    lineHeight: 20,
  },
  alerta: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  alertaTexto: {
    fontSize: 13,
    lineHeight: 19,
  },
  cartao: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
    padding: 18,
    boxShadow: '0 0 18px rgba(255, 0, 170, 0.13)',
  },
  rotulo: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  dados: {
    gap: 3,
  },
  dadoPrincipal: {
    fontSize: 16,
    fontWeight: '800',
  },
  dadoSecundario: {
    fontSize: 13,
    lineHeight: 19,
  },
  botaoSecundario: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 14,
  },
  textoBotaoSecundario: {
    fontSize: 13,
    fontWeight: '800',
  },
  previa: {
    aspectRatio: 1,
    borderRadius: 14,
    width: '100%',
  },
  previaVazia: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 16,
  },
  acoesFoto: {
    flexDirection: 'row',
    gap: 10,
  },
  acoesFinais: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelar: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  salvar: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1.35,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  textoSalvar: {
    fontSize: 13,
    fontWeight: '900',
  },
});
