export type EspeciePet = 'cachorro' | 'gato' | 'ave' | 'outro';
export type PortePet = 'pequeno' | 'medio' | 'grande';
export type StatusPasseio = 'pendente' | 'concluido' | 'cancelado';

export type LocalPasseio = {
  latitude: number;
  longitude: number;
  precisaoMetros: number;
};

/** Dados de um pet exatamente como são serializados pela API REST. */
export type Pet = {
  id: string;
  nome: string;
  especie: EspeciePet;
  porte: PortePet;
  statusPasseio: StatusPasseio;
  idadeMeses: number;
  criadoEm: string;
  local?: LocalPasseio;
  fotoUri?: string;
};

/** Campos aceitos no cadastro; identidade e status pertencem ao servidor. */
export type NovoPet = Omit<Pet, 'id' | 'statusPasseio' | 'criadoEm'>;
export type AtualizacaoPet = Partial<NovoPet>;
export type ResumoPet = Pick<Pet, 'id' | 'nome' | 'especie' | 'statusPasseio'>;

export type EstadoTela<T> =
  | { tipo: 'carregando' }
  | { tipo: 'sucesso'; dados: T }
  | { tipo: 'erro'; mensagem: string };

export function rotuloStatusPasseio(status: StatusPasseio): string {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'concluido':
      return 'Concluído';
    case 'cancelado':
      return 'Cancelado';
  }
}

export function rotuloEspecie(especie: EspeciePet): string {
  switch (especie) {
    case 'cachorro':
      return 'Cachorro';
    case 'gato':
      return 'Gato';
    case 'ave':
      return 'Ave';
    case 'outro':
      return 'Outro';
  }
}

export function rotuloPorte(porte: PortePet): string {
  switch (porte) {
    case 'pequeno':
      return 'Pequeno';
    case 'medio':
      return 'Médio';
    case 'grande':
      return 'Grande';
  }
}
