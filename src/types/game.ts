export type CardState = 'hidden' | 'revealed' | 'matched';
export type GameStatus = 'idle' | 'playing' | 'checking' | 'completed';

export interface CardData {
  id: number;
  value: string;
  state: CardState;
  position: number;
}

export interface BoardSize {
  rows: number;
  cols: number;
}

export interface GameState {
  cards: CardData[];
  moves: number;
  timeElapsed: number;
  status: GameStatus;
  selectedCards: number[];
  boardSize: BoardSize;
}
