import {
  gameSlice,
  initializeGame,
  flipCard,
  checkMatch,
  updateTimer,
  resetGame,
} from '../store/gameSlice';
import { CardData, GameState, CardState } from '../types/game';

describe('Game Slice', () => {
  const mockCards: CardData[] = [
    { id: 1, value: 'A', state: 'hidden' as CardState, position: 0 },
    { id: 2, value: 'A', state: 'hidden' as CardState, position: 1 },
    { id: 3, value: 'B', state: 'hidden' as CardState, position: 2 },
    { id: 4, value: 'B', state: 'hidden' as CardState, position: 3 },
    { id: 5, value: 'C', state: 'hidden' as CardState, position: 4 },
    { id: 6, value: 'C', state: 'hidden' as CardState, position: 5 },
  ];

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
    const state = gameSlice.reducer(initialState, initializeGame(mockCards));
    expect(state.cards).toHaveLength(mockCards.length);
    expect(state.status).toBe('idle');
    expect(state.moves).toBe(0);
    expect(state.timeElapsed).toBe(0);
    expect(state.selectedCards).toHaveLength(0);
  });

  it('should flip a card and start the game', () => {
    const action = flipCard(1);
    const state = gameSlice.reducer({ ...initialState, cards: mockCards }, action);
    expect(state.status).toBe('playing');
    expect(state.cards[0].state).toBe('revealed');
    expect(state.selectedCards).toContain(1);
  });

  it('should not flip a card if two cards are already selected', () => {
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: mockCards,
        selectedCards: [2, 3],
      },
      flipCard(1)
    );

    expect(state.cards[0].state).toBe('hidden');
    expect(state.selectedCards).toEqual([2, 3]);
  });

  it('should increment moves when selecting second card', () => {
    let state = gameSlice.reducer({ ...initialState, cards: mockCards }, flipCard(1));
    state = gameSlice.reducer(state, flipCard(2));

    expect(state.moves).toBe(1);
    expect(state.status).toBe('checking');
  });

  it('should handle matching cards', () => {
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: mockCards,
        selectedCards: [1, 2],
        status: 'checking',
      },
      checkMatch()
    );

    expect(state.cards[0].state).toBe('matched');
    expect(state.cards[1].state).toBe('matched');
    expect(state.selectedCards).toHaveLength(0);
    expect(state.status).toBe('playing');
  });

  it('should handle non-matching cards', () => {
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: mockCards,
        selectedCards: [1, 3],
        status: 'checking',
      },
      checkMatch()
    );

    expect(state.cards[0].state).toBe('hidden');
    expect(state.cards[2].state).toBe('hidden');
    expect(state.selectedCards).toHaveLength(0);
    expect(state.status).toBe('playing');
  });

  it('should set status to completed when all cards are matched', () => {
    const matchedCards = mockCards.map(card => ({ ...card, state: 'matched' as CardState }));
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

  it('should increment timer only when playing', () => {
    const playingState = gameSlice.reducer({ ...initialState, status: 'playing' }, updateTimer());
    expect(playingState.timeElapsed).toBe(1);

    const idleState = gameSlice.reducer({ ...initialState, status: 'idle' }, updateTimer());
    expect(idleState.timeElapsed).toBe(0);
  });

  it('does shuffle cards works properly', () => {
    // info: There is small chance that cards will be in the same position, due to the simple shuffle algorithm
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: mockCards,
      },
      initializeGame(mockCards)
    );
    const isPositionDifferent = state.cards.some((card, index) =>
      card.value !== mockCards[index].value
    );

    expect(isPositionDifferent).toBe(true);
  });


  it('does reset game provide proper state', () => {
    const state = gameSlice.reducer(
      {
        ...initialState,
        cards: mockCards,
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
    expect(state.cards).toHaveLength(mockCards.length);
    expect(state.cards.every(card => card.state === 'hidden')).toBe(true);
  });
});
