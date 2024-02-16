import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../store/gameSlice';
import { GameState } from '../types/game';

export const createMockStore = (initialState: Partial<GameState> = {}) => {
  const defaultState: GameState = {
    cards: [],
    status: 'playing',
    moves: 0,
    timeElapsed: 0,
    selectedCards: [],
    boardSize: { rows: 4, cols: 4 },
  };

  return configureStore({
    reducer: {
      game: gameReducer,
    },
    preloadedState: {
      game: {
        ...defaultState,
        ...initialState,
      },
    },
  });
};
