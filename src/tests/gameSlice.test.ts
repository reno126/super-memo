import {
  gameSlice,
  initializeGame,
  flipCard,
  checkMatch,
  updateTimer,
  resetGame,
} from '../store/gameSlice';
import { CardData, GameState } from '../types/game';
import { revealedCards, testCards } from './fixtures/gameFixtures';

describe('Game Slice', () => {
  const initialState: GameState = {
    cards: [],
    moves: 0,
    timeElapsed: 0,
    status: 'idle',
    selectedCards: [],
    boardSize: { rows: 4, cols: 4 },
  };

  it('should handle initial state', () => {
    expect(gameSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should initialize game with proper state', () => {
    const state = gameSlice.reducer(initialState, initializeGame(testCards));
    expect(state.cards).toHaveLength(testCards.length);
    expect(state.status).toBe('idle');
    expect(state.moves).toBe(0);
    expect(state.timeElapsed).toBe(0);
    expect(state.selectedCards).toHaveLength(0);
  });

  it('should flip a card and start the game', () => {
    const action = flipCard(1);
    const state = gameSlice.reducer({ ...initialState, cards: testCards }, action);
    expect(state.status).toBe('playing');
    const flippedCard = state.cards.find(card => card.id === 1);
    expect(flippedCard?.state).toBe('revealed');
    expect(state.selectedCards).toContain(1);
  });

  it('should not flip a card if two cards are already selected', () => {
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: testCards,
        selectedCards: [2, 3],
      },
      flipCard(1)
    );

    const targetCard = state.cards.find(card => card.id === 1);
    expect(targetCard?.state).toBe('hidden');
    expect(state.selectedCards).toEqual([2, 3]);
  });

  it('should not flip a card that is already revealed or matched', () => {
    const stateAfterRevealedClick = gameSlice.reducer(
      { ...initialState, cards: revealedCards },
      flipCard(1)
    );
    expect(stateAfterRevealedClick.selectedCards).toHaveLength(0);

    const stateAfterMatchedClick = gameSlice.reducer(
      { ...initialState, cards: revealedCards },
      flipCard(2)
    );
    expect(stateAfterMatchedClick.selectedCards).toHaveLength(0);
  });

  it('should ignore non-existent card ID on flipCard', () => {
    const state = gameSlice.reducer({ ...initialState, cards: testCards }, flipCard(9999));
    expect(state.selectedCards).toHaveLength(0);
    expect(state.status).toBe('idle');
  });

  it('should increment moves when selecting second card', () => {
    let state = gameSlice.reducer({ ...initialState, cards: testCards }, flipCard(1));
    state = gameSlice.reducer(state, flipCard(2));

    expect(state.moves).toBe(1);
    expect(state.status).toBe('checking');
  });

  it('should handle matching cards', () => {
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: testCards,
        selectedCards: [1, 2],
        status: 'checking',
      },
      checkMatch()
    );

    const firstCard = state.cards.find(card => card.id === 1);
    const secondCard = state.cards.find(card => card.id === 2);
    expect(firstCard?.state).toBe('matched');
    expect(secondCard?.state).toBe('matched');
    expect(state.selectedCards).toHaveLength(0);
    expect(state.status).toBe('playing');
  });

  it('should handle non-matching cards', () => {
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: testCards,
        selectedCards: [1, 3],
        status: 'checking',
      },
      checkMatch()
    );

    const firstCard = state.cards.find(card => card.id === 1);
    const thirdCard = state.cards.find(card => card.id === 3);
    expect(firstCard?.state).toBe('hidden');
    expect(thirdCard?.state).toBe('hidden');
    expect(state.selectedCards).toHaveLength(0);
    expect(state.status).toBe('playing');
  });

  it('should safely bail out of checkMatch if less than two cards are selected or IDs are invalid', () => {
    const singleSelectedState = gameSlice.reducer(
      { ...initialState, cards: testCards, selectedCards: [1] },
      checkMatch()
    );
    expect(singleSelectedState.selectedCards).toEqual([1]);

    const invalidIdState = gameSlice.reducer(
      { ...initialState, cards: testCards, selectedCards: [9998, 9999], status: 'checking' },
      checkMatch()
    );
    expect(invalidIdState.selectedCards).toHaveLength(0);
    expect(invalidIdState.status).toBe('playing');
  });

  it('should set status to completed when all cards are matched', () => {
    const matchedCards: CardData[] = testCards.map(card => ({ ...card, state: 'matched' }));
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: matchedCards,
        selectedCards: [3, 4],
        status: 'checking',
      },
      checkMatch()
    );

    expect(state.status).toBe('completed');
  });

  it('should increment timer during playing and checking status, but not idle or completed', () => {
    const playingState = gameSlice.reducer({ ...initialState, status: 'playing' }, updateTimer());
    expect(playingState.timeElapsed).toBe(1);

    const checkingState = gameSlice.reducer(
      { ...initialState, status: 'checking', timeElapsed: 2 },
      updateTimer()
    );
    expect(checkingState.timeElapsed).toBe(3);

    const idleState = gameSlice.reducer({ ...initialState, status: 'idle' }, updateTimer());
    expect(idleState.timeElapsed).toBe(0);

    const completedState = gameSlice.reducer(
      { ...initialState, status: 'completed', timeElapsed: 15 },
      updateTimer()
    );
    expect(completedState.timeElapsed).toBe(15);
  });

  it('shuffles cards and preserves all card items with unique positions', () => {
    const state = gameSlice.reducer(initialState, initializeGame(testCards));

    expect(state.cards).toHaveLength(testCards.length);
    const sortedOriginalValues = [...testCards.map(card => card.value)].sort();
    const sortedShuffledValues = [...state.cards.map(card => card.value)].sort();
    expect(sortedShuffledValues).toEqual(sortedOriginalValues);

    const positions = state.cards.map(card => card.position);
    const uniquePositions = new Set(positions);
    expect(uniquePositions.size).toBe(testCards.length);
  });

  it('does reset game provide proper state and reset all cards to hidden', () => {
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: testCards.map(card => ({ ...card, state: 'matched' })),
        moves: 5,
        timeElapsed: 30,
        status: 'completed',
        selectedCards: [1, 2],
      },
      resetGame()
    );

    expect(state.moves).toBe(0);
    expect(state.timeElapsed).toBe(0);
    expect(state.status).toBe('idle');
    expect(state.selectedCards).toHaveLength(0);
    expect(state.cards).toHaveLength(testCards.length);
    expect(state.cards.every(card => card.state === 'hidden')).toBe(true);
  });
});
