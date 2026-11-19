import { Host, Picker, Switch } from '@expo/ui';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/theme-context';

type MetaPasseio = 'curto' | 'moderado' | 'longo';

export function NativePetReminderSettings() {
  const { colors } = useTheme();
  const [lembretesAtivos, setLembretesAtivos] = useState(true);
  const [meta, setMeta] = useState<MetaPasseio>('moderado');

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
        <View style={[styles.indicador, { backgroundColor: colors.secondary }]} />
        <View style={styles.textosCabecalho}>
          <Text style={[styles.sobrelinha, { color: colors.secondary }]}>PAINEL NATIVO</Text>
          <Text style={[styles.titulo, { color: colors.text }]}>Rotina de passeio</Text>
        </View>
      </View>

      <Text style={[styles.descricao, { color: colors.muted }]}>
        Ajustes do sistema para a agenda do seu companheiro.
      </Text>

      <Host matchContents>
        <Switch
          value={lembretesAtivos}
          onValueChange={setLembretesAtivos}
          label="Lembretes diários"
        />
      </Host>

      <View style={styles.metaArea}>
        <Text style={[styles.rotulo, { color: colors.text }]}>Meta de passeio</Text>
        <Host matchContents>
          <Picker<MetaPasseio>
            appearance="menu"
            selectedValue={meta}
            onValueChange={setMeta}
          >
            <Picker.Item label="Curto" value="curto" />
            <Picker.Item label="Moderado" value="moderado" />
            <Picker.Item label="Longo" value="longo" />
          </Picker>
        </Host>
      </View>

      <Text style={[styles.rodape, { color: colors.muted }]}>
        {lembretesAtivos
          ? 'Lembretes locais estão ligados para sua rotina.'
          : 'Você pode reativar os lembretes quando quiser.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    boxShadow: '0 0 18px rgba(0, 245, 255, 0.16)',
  },
  cabecalho: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  indicador: {
    borderRadius: 4,
    height: 32,
    width: 4,
  },
  textosCabecalho: {
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
  descricao: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaArea: {
    gap: 8,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '700',
  },
  rodape: {
    fontSize: 12,
    lineHeight: 18,
  },
});
