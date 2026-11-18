import type { Pet } from '../types/pet';
import { CardPet } from './card-pet';

type ItemPetProps = {
  pet: Pet;
  onPress: (id: string) => void;
};

export function ItemPet({ pet, onPress }: ItemPetProps) {
  return <CardPet pet={pet} onPress={() => onPress(pet.id)} />;
}
