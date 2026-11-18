import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/theme-context';
import { espaco, raio, tipografia } from '../theme';
import type { Pet } from '../types/pet';
import { rotuloEspecie, rotuloPorte, rotuloStatusPasseio } from '../types/pet';
import { Card } from './card';
import { StatusPill } from './cyber-ui';

type CardPetProps = {
  pet: Pet;
  onPress: () => void;
};

function statusTone(status: Pet['statusPasseio']): 'warning' | 'success' | 'danger' {
  switch (status) {
    case 'pendente':
      return 'warning';
    case 'concluido':
      return 'success';
    case 'cancelado':
      return 'danger';
  }
}

export function CardPet({ pet, onPress }: CardPetProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir prontuário de ${pet.nome}`}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Card destacado={pet.statusPasseio === 'pendente'}>
        <View style={styles.header}>
          {pet.fotoUri ? (
            <Image
              source={{ uri: pet.fotoUri }}
              style={[styles.avatar, { borderColor: colors.primary }]}
              contentFit="cover"
              recyclingKey={pet.id}
              transition={200}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.surfaceAlt, borderColor: colors.primary }]}>
              <Feather color={colors.primary} name="heart" size={24} />
            </View>
          )}

          <View style={styles.identification}>
            <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>{pet.nome}</Text>
            <Text style={[styles.meta, { color: colors.muted }]}>
              {rotuloEspecie(pet.especie)} · {rotuloPorte(pet.porte)}
            </Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>{pet.idadeMeses} meses</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <StatusPill tone={statusTone(pet.statusPasseio)}>{rotuloStatusPasseio(pet.statusPasseio)}</StatusPill>
          <View style={styles.openDetail}>
            <Text style={[styles.openText, { color: colors.secondary }]}>ver prontuário</Text>
            <Feather color={colors.secondary} name="arrow-up-right" size={16} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: raio.lg,
  },
  pressed: {
    opacity: 0.78,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: espaco.md,
  },
  avatar: {
    borderRadius: raio.md,
    borderWidth: 1,
    height: 72,
    width: 72,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  identification: {
    flex: 1,
    gap: espaco.xs,
  },
  name: {
    ...tipografia.subtitulo,
  },
  meta: {
    ...tipografia.legenda,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  openDetail: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: espaco.xs,
  },
  openText: {
    ...tipografia.etiqueta,
  },
});
