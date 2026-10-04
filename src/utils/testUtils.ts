import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../store/gameSlice';
import { BoardSize, GameState } from '../types/game';

type GameStateOverrides = Omit<Partial<GameState>, 'boardSize'> & {
  boardSize?: Partial<BoardSize>;
};

export function createTestGameState(gameStateOverrides: GameStateOverrides = {}): GameState {
  const defaultGameState: GameState = {
    cards: [],
    status: 'idle',
    moves: 0,
    timeElapsed: 0,
    selectedCards: [],
    boardSize: { rows: 4, cols: 4 },
  };

  return {
    ...defaultGameState,
    ...gameStateOverrides,
    boardSize: {
      ...defaultGameState.boardSize,
      ...gameStateOverrides.boardSize,
    },
  };
}

export const createMockStore = (preloadedGameState: GameState = createTestGameState()) => {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
    preloadedState: {
      game: preloadedGameState,
    },
  });
};
