import { create } from 'zustand';

import { apiFetch } from '../services/api';
import type { AtualizacaoPet, NovoPet, Pet } from '../types/pet';

type PetStore = {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  addPet: (novoPet: NovoPet) => Promise<void>;
  togglePasseio: (id: string) => Promise<void>;
  registrarPasseio: (id: string, local?: Pet['local'], fotoUri?: string) => Promise<void>;
  updatePet: (id: string, dados: AtualizacaoPet) => Promise<void>;
  removePet: (id: string) => Promise<void>;
  clearPets: () => void;
};

type DeletePetResponse = {
  success: boolean;
  id: string;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
}

export const usePetStore = create<PetStore>((set) => ({
  pets: [],
  isLoading: false,
  error: null,

  fetchPets: async () => {
    set({ isLoading: true, error: null });
    try {
      const pets = await apiFetch<Pet[]>('/pets');
      set({ pets });
    } catch (error) {
      set({ error: errorMessage(error) });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addPet: async (novoPet) => {
    set({ isLoading: true, error: null });
    try {
      const createdPet = await apiFetch<Pet>('/pets', {
        method: 'POST',
        body: novoPet,
      });
      set((state) => ({ pets: [createdPet, ...state.pets] }));
    } catch (error) {
      set({ error: errorMessage(error) });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  togglePasseio: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPet = await apiFetch<Pet>(`/pets/${id}/toggle`, { method: 'PATCH' });
      set((state) => ({
        pets: state.pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)),
      }));
    } catch (error) {
      set({ error: errorMessage(error) });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  registrarPasseio: async (id, local, fotoUri) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPet = await apiFetch<Pet>(`/pets/${id}/passeio`, {
        method: 'PATCH',
        body: { statusPasseio: 'concluido', local, fotoUri },
      });
      set((state) => ({
        pets: state.pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)),
      }));
    } catch (error) {
      set({ error: errorMessage(error) });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePet: async (id, dados) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPet = await apiFetch<Pet>(`/pets/${id}`, {
        method: 'PUT',
        body: dados,
      });
      set((state) => ({
        pets: state.pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)),
      }));
    } catch (error) {
      set({ error: errorMessage(error) });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removePet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiFetch<DeletePetResponse>(`/pets/${id}`, { method: 'DELETE' });
      if (!result.success) {
        throw new Error('Não foi possível remover este pet.');
      }
      set((state) => ({ pets: state.pets.filter((pet) => pet.id !== result.id) }));
    } catch (error) {
      set({ error: errorMessage(error) });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearPets: () => set({ pets: [], error: null, isLoading: false }),
}));
