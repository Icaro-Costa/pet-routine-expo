import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '../context/theme-context';
import { usePetStore } from '../store/use-pet-store';

type FalhaFoto =
  | 'camera-negada'
  | 'camera-bloqueada'
  | 'galeria-negada'
  | 'galeria-bloqueada';

const MENSAGENS_FALHA: Record<FalhaFoto, string> = {
  'camera-negada': 'A câmera foi negada. Toque novamente para permitir o acesso.',
  'camera-bloqueada': 'A câmera foi bloqueada. Habilite-a nas configurações do aparelho.',
  'galeria-negada': 'A galeria foi negada. Toque novamente para permitir o acesso.',
  'galeria-bloqueada': 'A galeria foi bloqueada. Habilite-a nas configurações do aparelho.',
};

export default function TelaFotoDoPet() {
  const router = useRouter();
  const parametros = useLocalSearchParams();
  const rawPetId = parametros.petId;
  const petId = Array.isArray(rawPetId) ? rawPetId[0] : rawPetId;
  const { colors } = useTheme();
  const updatePet = usePetStore((state) => state.updatePet);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [falha, setFalha] = useState<FalhaFoto | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function escolherDaGaleria() {
    setErro(null);
    setFalha(null);
    try {
      // Contrato de três tempos: PEDIR a galeria, LER a imagem e PARAR sem manter sessão aberta.
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissao.status !== 'granted') {
        setFalha(permissao.canAskAgain ? 'galeria-negada' : 'galeria-bloqueada');
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
      setFalha(null);
    } catch {
      setErro('Não foi possível abrir a galeria. Tente novamente.');
    }
  }

  async function tirarFoto() {
    setErro(null);
    setFalha(null);
    try {
      // Contrato de três tempos: PEDIR a câmera, LER uma captura e PARAR ao fechar o seletor.
      const permissao = await ImagePicker.requestCameraPermissionsAsync();
      if (permissao.status !== 'granted') {
        setFalha(permissao.canAskAgain ? 'camera-negada' : 'camera-bloqueada');
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
      setFalha(null);
    } catch {
      setErro('Não foi possível abrir a câmera. Tente novamente ou escolha da galeria.');
    }
  }

  async function concluir() {
    if (!fotoUri) {
      return;
    }

    if (!petId) {
      setErro('Selecione um pet na lista antes de atualizar a foto.');
      return;
    }

    try {
      setSalvando(true);
      await updatePet(petId, { fotoUri });
      router.back();
    } catch (error: unknown) {
      setErro(error instanceof Error ? error.message : 'Não foi possível salvar a foto.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={[styles.tela, { backgroundColor: colors.background }]}>
      <View style={styles.cabecalho}>
        <Text style={[styles.sobrelinha, { color: colors.secondary }]}>IDENTIDADE VISUAL</Text>
        <Text style={[styles.titulo, { color: colors.text }]}>Foto do pet</Text>
        <Text style={[styles.descricao, { color: colors.muted }]}>
          Recorte uma imagem quadrada para o perfil da sua companhia.
        </Text>
      </View>

      {fotoUri ? (
        <Image contentFit="cover" source={{ uri: fotoUri }} style={styles.previa} />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.placeholderIcone, { color: colors.primary }]}>◈</Text>
          <Text style={[styles.placeholderTexto, { color: colors.muted }]}>
            Nenhuma imagem selecionada
          </Text>
        </View>
      )}

      {erro ? <Text accessibilityRole="alert" style={{ color: colors.danger }}>{erro}</Text> : null}
      {falha ? (
        <View
          style={[
            styles.falha,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.warning,
            },
          ]}
        >
          <Text style={[styles.falhaTexto, { color: colors.text }]}>
            {MENSAGENS_FALHA[falha]}
          </Text>
        </View>
      ) : null}

      <View style={styles.acoes}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tirar foto do pet"
          onPress={() => {
            void tirarFoto();
          }}
          style={({ pressed }) => [
            styles.botaoSecundario,
            {
              borderColor: colors.secondary,
              opacity: pressed ? 0.65 : 1,
            },
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
            {
              borderColor: colors.accent,
              opacity: pressed ? 0.65 : 1,
            },
          ]}
        >
          <Text style={[styles.textoBotaoSecundario, { color: colors.accent }]}>
            Galeria
          </Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Salvar foto do pet"
        disabled={!fotoUri || salvando}
        onPress={() => {
          void concluir();
        }}
        style={({ pressed }) => [
          styles.botaoConcluir,
          {
            backgroundColor: colors.primary,
            opacity: pressed || !fotoUri || salvando ? 0.55 : 1,
          },
        ]}
      >
        {salvando ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={[styles.textoConcluir, { color: colors.background }]}>Concluir</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    gap: 16,
    padding: 20,
  },
  cabecalho: {
    gap: 6,
  },
  sobrelinha: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '900',
  },
  descricao: {
    fontSize: 14,
    lineHeight: 20,
  },
  previa: {
    aspectRatio: 1,
    borderRadius: 20,
    width: '100%',
  },
  placeholder: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    justifyContent: 'center',
  },
  placeholderIcone: {
    fontSize: 52,
  },
  placeholderTexto: {
    fontSize: 14,
    fontWeight: '700',
  },
  falha: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  falhaTexto: {
    fontSize: 13,
    lineHeight: 19,
  },
  acoes: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoSecundario: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  textoBotaoSecundario: {
    fontSize: 13,
    fontWeight: '800',
  },
  botaoConcluir: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 50,
  },
  textoConcluir: {
    fontSize: 14,
    fontWeight: '900',
  },
});
