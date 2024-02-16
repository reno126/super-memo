import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, BoardSize, CardData } from '../types/game';

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

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (_state, action: PayloadAction<CardData[]>) => ({
      ...initialState,
      cards: action.payload,
    }),

    flipCard: () => {
      // TODO: to be add
    },

    checkMatch: () => {
      // TODO: to be add
    },

    updateTimer: () => {
      // TODO: to be add
    },

    resetGame: () => ({
      ...initialState,
    }),
  },
});

export const { initializeGame, flipCard, checkMatch, updateTimer, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
