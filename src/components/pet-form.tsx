import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '../context/theme-context';
import { espaco, raio, tipografia } from '../theme';
import type { EspeciePet, NovoPet, PortePet } from '../types/pet';
import { rotuloEspecie, rotuloPorte } from '../types/pet';
import { NeonButton } from './cyber-ui';

type PetFormProps = {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (pet: NovoPet) => Promise<void>;
};

const especies: EspeciePet[] = ['cachorro', 'gato', 'ave', 'outro'];
const portes: PortePet[] = ['pequeno', 'medio', 'grande'];

export function PetForm({ isSubmitting, onCancel, onSubmit }: PetFormProps) {
  const { colors } = useTheme();
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('12');
  const [especie, setEspecie] = useState<EspeciePet>('cachorro');
  const [porte, setPorte] = useState<PortePet>('medio');
  const [formError, setFormError] = useState<string | null>(null);

  const idadeMeses = Number.parseInt(idade, 10);
  const isValid = nome.trim().length > 0 && Number.isInteger(idadeMeses) && idadeMeses >= 0;

  async function handleSubmit() {
    if (!isValid || isSubmitting) {
      setFormError('Informe um nome e uma idade em meses válida.');
      return;
    }

    setFormError(null);
    try {
      await onSubmit({
        nome: nome.trim(),
        especie,
        porte,
        idadeMeses,
      });
    } catch (error: unknown) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível cadastrar o pet.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Identificação</Text>
        <TextInput
          accessibilityLabel="Nome do pet"
          autoCapitalize="words"
          onChangeText={setNome}
          placeholder="Ex.: Nori"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          value={nome}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Espécie</Text>
        <View style={styles.choices}>
          {especies.map((item) => {
            const selected = especie === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setEspecie(item)}
                style={({ pressed }) => [
                  styles.choice,
                  {
                    backgroundColor: selected ? colors.primary : colors.surfaceAlt,
                    borderColor: selected ? colors.primary : colors.border,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <Text style={[styles.choiceText, { color: selected ? colors.background : colors.text }]}>
                  {rotuloEspecie(item)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Porte</Text>
        <View style={styles.choices}>
          {portes.map((item) => {
            const selected = porte === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setPorte(item)}
                style={({ pressed }) => [
                  styles.choice,
                  {
                    backgroundColor: selected ? colors.secondary : colors.surfaceAlt,
                    borderColor: selected ? colors.secondary : colors.border,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <Text style={[styles.choiceText, { color: selected ? colors.background : colors.text }]}>
                  {rotuloPorte(item)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Idade (em meses)</Text>
        <TextInput
          accessibilityLabel="Idade em meses"
          keyboardType="number-pad"
          onChangeText={setIdade}
          placeholder="12"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          value={idade}
        />
      </View>

      {formError ? <Text style={[styles.error, { color: colors.danger }]}>{formError}</Text> : null}

      <View style={styles.actions}>
        <View style={styles.actionItem}>
          <NeonButton disabled={isSubmitting} onPress={onCancel} variant="ghost">Cancelar</NeonButton>
        </View>
        <View style={styles.actionItem}>
          <NeonButton disabled={!isValid || isSubmitting} onPress={handleSubmit}>
            {isSubmitting ? 'Sincronizando…' : 'Cadastrar pet'}
          </NeonButton>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: espaco.lg,
    padding: espaco.lg,
  },
  field: {
    gap: espaco.sm,
  },
  label: {
    ...tipografia.etiqueta,
  },
  input: {
    borderRadius: raio.md,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.sm,
    ...tipografia.corpo,
  },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.sm,
  },
  choice: {
    borderRadius: raio.pill,
    borderWidth: 1,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.sm,
  },
  choiceText: {
    ...tipografia.etiqueta,
  },
  error: {
    ...tipografia.legenda,
  },
  actions: {
    flexDirection: 'row',
    gap: espaco.sm,
  },
  actionItem: {
    flex: 1,
  },
});
