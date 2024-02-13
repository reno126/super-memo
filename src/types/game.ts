export type CardState = 'hidden' | 'revealed' | 'matched';

export interface CardData {
  id: number;
  value: string;
  state: CardState;
  position: number;
}