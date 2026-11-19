import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Eyebrow, NeonButton, NeonCard, Screen, StatusPill } from '../../components/cyber-ui';
import { ItemPet } from '../../components/item-pet';
import { ListaVazia } from '../../components/lista-vazia';
import { PetForm } from '../../components/pet-form';
import { useTheme } from '../../context/theme-context';
import { agrupar, filtrarPorNome, type Secao } from '../../lib/agrupar';
import { usePetStore } from '../../store/use-pet-store';
import { espaco, raio, tipografia } from '../../theme';
import type { Pet } from '../../types/pet';

type PetListItemProps = {
  pet: Pet;
};

function PetListItem({ pet }: PetListItemProps) {
  const router = useRouter();

  return <ItemPet pet={pet} onPress={(id) => router.push(`/pet/${id}`)} />;
}

function renderPetItem({ item }: { item: Pet }) {
  return <PetListItem pet={item} />;
}

function SectionHeader({ title }: { title: string }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}> 
      <Text style={[styles.sectionTitle, { color: colors.secondary }]}>{title}</Text>
      <View style={[styles.sectionLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

export default function TelaMeusPets() {
  const { colors } = useTheme();
  const pets = usePetStore((state) => state.pets);
  const isLoading = usePetStore((state) => state.isLoading);
  const error = usePetStore((state) => state.error);
  const fetchPets = usePetStore((state) => state.fetchPets);
  const addPet = usePetStore((state) => state.addPet);
  const [busca, setBusca] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void fetchPets().catch(() => undefined);
  }, [fetchPets]);

  const secoes = useMemo(() => agrupar(filtrarPorNome(pets, busca)), [busca, pets]);
  const pendingCount = useMemo(
    () => pets.filter((pet) => pet.statusPasseio === 'pendente').length,
    [pets],
  );

  async function handleAddPet(pet: Parameters<typeof addPet>[0]) {
    setIsSaving(true);
    try {
      await addPet(pet);
      setFormVisible(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Screen>
      <SectionList<Pet, Secao>
        contentContainerStyle={styles.content}
        sections={secoes}
        keyExtractor={(item) => item.id}
        renderItem={renderPetItem}
        renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
        ListEmptyComponent={<ListaVazia termoBusca={busca} />}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={() => void fetchPets().catch(() => undefined)}
            refreshing={isLoading && pets.length > 0}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={styles.topLine}>
              <View style={styles.topCopy}>
                <Eyebrow>Pet Routine // 2077</Eyebrow>
                <Text style={[styles.title, { color: colors.text }]}>Meus pets</Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>Acompanhe cada órbita de cuidado.</Text>
              </View>
              <View style={styles.counter}>
                <StatusPill tone={pendingCount > 0 ? 'warning' : 'success'}>
                  {pendingCount} pendente{pendingCount === 1 ? '' : 's'}
                </StatusPill>
              </View>
            </View>

            <NeonCard accent="secondary">
              <View style={styles.searchLabel}>
                <Feather color={colors.secondary} name="search" size={18} />
                <Text style={[styles.searchText, { color: colors.textMuted }]}>LOCALIZAR COMPANHEIRO</Text>
              </View>
              <TextInput
                accessibilityLabel="Buscar pet por nome"
                onChangeText={setBusca}
                placeholder="Buscar pelo nome do pet…"
                placeholderTextColor={colors.textMuted}
                style={[styles.searchInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                value={busca}
              />
            </NeonCard>

            {error ? (
              <NeonCard accent="accent">
                <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                <NeonButton onPress={() => void fetchPets().catch(() => undefined)} variant="ghost">Tentar novamente</NeonButton>
              </NeonCard>
            ) : null}

            {isLoading && pets.length === 0 ? (
              <View style={styles.loading}>
                <ActivityIndicator color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.muted }]}>Sincronizando a matilha…</Text>
              </View>
            ) : null}
          </View>
        }
      />

      <View style={styles.createAction}>
        <NeonButton accessibilityLabel="Cadastrar novo pet" onPress={() => setFormVisible(true)}>
          <View style={styles.buttonContent}>
            <Feather color={colors.background} name="plus" size={18} />
            <Text style={[styles.createText, { color: colors.background }]}>Novo pet</Text>
          </View>
        </NeonButton>
      </View>

      <Modal animationType="slide" onRequestClose={() => setFormVisible(false)} transparent visible={formVisible}>
        <View style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}> 
          <View style={[styles.modalPanel, { backgroundColor: colors.surface, borderColor: colors.primary }]}> 
            <View style={styles.modalHeader}>
              <View style={styles.modalCopy}>
                <Eyebrow>Novo sinal</Eyebrow>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Cadastrar pet</Text>
              </View>
              <StatusPill tone="secondary">online</StatusPill>
            </View>
            <PetForm isSubmitting={isSaving} onCancel={() => setFormVisible(false)} onSubmit={handleAddPet} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: espaco.md,
    padding: espaco.md,
    paddingBottom: 104,
  },
  headerContent: {
    gap: espaco.md,
  },
  topLine: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: espaco.sm,
    justifyContent: 'space-between',
  },
  topCopy: {
    flex: 1,
    gap: espaco.xs,
  },
  title: {
    ...tipografia.titulo,
  },
  subtitle: {
    ...tipografia.corpo,
  },
  counter: {
    paddingTop: espaco.xs,
  },
  searchLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: espaco.xs,
  },
  searchText: {
    ...tipografia.etiqueta,
    letterSpacing: 1,
  },
  searchInput: {
    borderRadius: raio.md,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.sm,
    ...tipografia.corpo,
  },
  errorText: {
    ...tipografia.corpo,
  },
  loading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: espaco.sm,
    justifyContent: 'center',
    padding: espaco.md,
  },
  loadingText: {
    ...tipografia.legenda,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: espaco.sm,
    paddingTop: espaco.sm,
  },
  sectionTitle: {
    ...tipografia.etiqueta,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionLine: {
    flex: 1,
    height: 1,
  },
  createAction: {
    bottom: espaco.md,
    left: espaco.md,
    position: 'absolute',
    right: espaco.md,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: espaco.sm,
  },
  createText: {
    ...tipografia.botao,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalPanel: {
    borderTopLeftRadius: raio.lg,
    borderTopRightRadius: raio.lg,
    borderWidth: 1,
    maxHeight: '88%',
    paddingTop: espaco.lg,
  },
  modalHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: espaco.sm,
    justifyContent: 'space-between',
    paddingHorizontal: espaco.lg,
  },
  modalCopy: {
    gap: espaco.xs,
  },
  modalTitle: {
    ...tipografia.subtitulo,
  },
});
