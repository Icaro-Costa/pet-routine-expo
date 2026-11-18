import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { NeonCard } from './cyber-ui';

type CardProps = {
  children: ReactNode;
  destacado?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, destacado = false, style }: CardProps) {
  return (
    <NeonCard accent={destacado ? 'secondary' : 'primary'} style={style}>
      {children}
    </NeonCard>
  );
}
