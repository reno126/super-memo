import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, BoardSize, CardData, CardState, GameStatus } from '../types/game';

const initialBoardSize: BoardSize = {
  rows: 4,
  cols: 4,
};

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

  areMatching: (card1: CardData, card2: CardData): boolean => card1.value === card2.value,

  allMatched: (cards: CardData[]): boolean => cards.every(card => card.state === 'matched'),
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

    checkMatch: state => {
      if (state.selectedCards.length !== 2) return;

      const selectedCards = state.cards.filter(card => state.selectedCards.includes(card.id));

      const [card1, card2] = selectedCards;
      const newState = cardActions.areMatching(card1, card2) ? 'matched' : 'hidden';

      state.cards = cardActions.updateState(state.cards, state.selectedCards, newState);

      state.selectedCards = [];

      if (cardActions.allMatched(state.cards)) {
        state.status = gameMappingState.toCompleted(state.status);
      } else {
        state.status = 'playing';
      }
    },

    updateTimer: state => {
      if (state.status !== 'idle' && state.status !== 'completed') {
        state.timeElapsed += 1;
      }
    },

    resetGame: state => ({
      ...initialState,
      cards: cardActions.shuffle(state.cards.map(card => ({ ...card, state: 'hidden' }))),
    }),
  },
});

export const { initializeGame, flipCard, checkMatch, updateTimer, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
