import { Store } from '@reduxjs/toolkit';
import { GameState } from '../types/game';

export interface MockStore extends Store {
  getState(): { game: GameState };
}

export function createMockStore(initialState?: Partial<GameState>): MockStore;
