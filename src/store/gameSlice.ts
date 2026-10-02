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
    const shuffledCards = cards.map((card, index) => ({ ...card, position: index }));
    for (let index = shuffledCards.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const currentCard = shuffledCards[index];
      const randomCard = shuffledCards[randomIndex];

      if (currentCard && randomCard) {
        shuffledCards[index] = { ...randomCard, position: index };
        shuffledCards[randomIndex] = { ...currentCard, position: randomIndex };
      }
    }
    return shuffledCards;
  },

  updateState: (cards: CardData[], cardIds: number[], newState: CardState): CardData[] =>
    cards.map(card => (cardIds.includes(card.id) ? { ...card, state: newState } : card)),

  isSelectable: (card: CardData): boolean => !['revealed', 'matched'].includes(card.state),

  areMatching: (firstCard: CardData, secondCard: CardData): boolean =>
    firstCard.value === secondCard.value,

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
      cards: cardActions.shuffle(action.payload.map(card => ({ ...card, state: 'hidden' }))),
    }),

    flipCard: (state, action: PayloadAction<number>) => {
      const cardId = action.payload;

      const targetCard = state.cards.find(card => card.id === cardId);

      if (!targetCard || !cardActions.isSelectable(targetCard) || state.selectedCards.length >= 2) {
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

      const firstSelectedId = state.selectedCards[0];
      const secondSelectedId = state.selectedCards[1];

      const firstCard = state.cards.find(card => card.id === firstSelectedId);
      const secondCard = state.cards.find(card => card.id === secondSelectedId);

      if (!firstCard || !secondCard) {
        state.selectedCards = [];
        return;
      }

      const isMatch = cardActions.areMatching(firstCard, secondCard);
      const targetState: CardState = isMatch ? 'matched' : 'hidden';

      state.cards = cardActions.updateState(
        state.cards,
        [firstCard.id, secondCard.id],
        targetState
      );
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
