import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, BoardSize, CardData, CardState, GameStatus } from '../types/game';

// Początkowy rozmiar planszy
const initialBoardSize: BoardSize = {
  rows: 4,
  cols: 4,
};

// Początkowy stan gry
const initialState: GameState = {
  cards: [],
  moves: 0,
  timeElapsed: 0,
  status: 'idle',
  selectedCards: [],
  boardSize: initialBoardSize,
};

const cardActions = {
  shuffle: (cards: CardData[]): CardData[] => {
    const shuffled = cards.map((card, index) => ({ ...card, position: index }));
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [
        { ...shuffled[j], position: i },
        { ...shuffled[i], position: j },
      ];
    }
    return shuffled;
  },
  updateState: (cards: CardData[], cardIds: number[], newState: CardState): CardData[] =>
    cards.map(card => (cardIds.includes(card.id) ? { ...card, state: newState } : card)),

  isSelectable: (card: CardData): boolean => !['revealed', 'matched'].includes(card.state),
};

const gameMappingState = {
  toPlaying: (currentStatus: GameStatus): GameStatus =>
    currentStatus === 'idle' ? 'playing' : currentStatus,

  toChecking: (currentStatus: GameStatus): GameStatus =>
    currentStatus === 'playing' ? 'checking' : currentStatus,

  toCompleted: (currentStatus: GameStatus): GameStatus =>
    currentStatus === 'checking' || currentStatus === 'playing' ? 'completed' : currentStatus,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (_state, action: PayloadAction<CardData[]>) => ({
      ...initialState,
      cards: cardActions.shuffle(action.payload),
    }),

    flipCard: (state, action: PayloadAction<number>) => {
      const cardId = action.payload;

      const card = state.cards.find(c => c.id === cardId);

      if (!card || !cardActions.isSelectable(card) || state.selectedCards.length >= 2) {
        return;
      }

      state.status = gameMappingState.toPlaying(state.status);
      state.cards = cardActions.updateState(state.cards, [cardId], 'revealed');
      state.selectedCards.push(cardId);

      if (state.selectedCards.length === 2) {
        state.moves += 1;
        state.status = gameMappingState.toChecking(state.status);
      }
    },

    checkMatch: () => {
      // TODO: to be add
    },

    updateTimer: () => {
      // TODO: to be add
    },

    resetGame: state => ({
      ...initialState,
      cards: cardActions.shuffle(state.cards.map(card => ({ ...card, state: 'hidden' }))),
    }),
  },
});

export const { initializeGame, flipCard, checkMatch, updateTimer, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
