import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useGameLogic } from '../hooks/useGameLogic';
import { createMockStore } from '../utils/testUtils';
import { findMatchingCardPair, findNonMatchingCardPair } from './fixtures/gameFixtures';

function createGameLogicProviderWrapper() {
  const store = createMockStore();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return wrapper;
}

describe('useGameLogic Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes game state correctly', () => {
    const wrapper = createGameLogicProviderWrapper();
    const { result } = renderHook(() => useGameLogic(), { wrapper });

    expect(result.current.cards).toHaveLength(16);
    expect(result.current.status).toBe('idle');
    expect(result.current.selectedCards).toHaveLength(0);
    expect(result.current.boardSize).toEqual({ rows: 4, cols: 4 });
    expect(result.current.moves).toBe(0);
    expect(result.current.timeElapsed).toBe(0);
  });

  it('handles card click correctly', () => {
    const wrapper = createGameLogicProviderWrapper();
    const { result } = renderHook(() => useGameLogic(), { wrapper });

    const firstCard = result.current.cards[0];
    expect(firstCard).toBeDefined();

    if (firstCard) {
      act(() => {
        result.current.handleCardClick(firstCard);
      });

      expect(result.current.selectedCards).toContain(firstCard.id);
      expect(result.current.status).toBe('playing');
    }
  });

  it('matches a selected pair after one second', () => {
    const wrapper = createGameLogicProviderWrapper();
    const { result } = renderHook(() => useGameLogic(), { wrapper });
    const [firstCard, secondCard] = findMatchingCardPair(result.current.cards);

    act(() => {
      result.current.handleCardClick(firstCard);
      result.current.handleCardClick(secondCard);
    });

    expect(result.current.selectedCards).toHaveLength(2);
    expect(result.current.moves).toBe(1);
    expect(result.current.status).toBe('checking');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const matchedCardIds = new Set([firstCard.id, secondCard.id]);
    const matchedCards = result.current.cards.filter(card => matchedCardIds.has(card.id));
    expect(matchedCards.every(card => card.state === 'matched')).toBe(true);
    expect(result.current.selectedCards).toHaveLength(0);
    expect(result.current.status).toBe('playing');
  });

  it('hides a selected non-matching pair after one second', () => {
    const wrapper = createGameLogicProviderWrapper();
    const { result } = renderHook(() => useGameLogic(), { wrapper });
    const [firstCard, secondCard] = findNonMatchingCardPair(result.current.cards);

    act(() => {
      result.current.handleCardClick(firstCard);
      result.current.handleCardClick(secondCard);
    });

    expect(result.current.status).toBe('checking');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const nonMatchingCardIds = new Set([firstCard.id, secondCard.id]);
    const nonMatchingCards = result.current.cards.filter(card => nonMatchingCardIds.has(card.id));
    expect(nonMatchingCards.every(card => card.state === 'hidden')).toBe(true);
    expect(result.current.selectedCards).toHaveLength(0);
    expect(result.current.status).toBe('playing');
  });

  it('handles timer updates correctly during play', () => {
    const wrapper = createGameLogicProviderWrapper();
    const { result } = renderHook(() => useGameLogic(), { wrapper });

    const firstCard = result.current.cards[0];
    expect(firstCard).toBeDefined();

    if (firstCard) {
      act(() => {
        result.current.handleCardClick(firstCard);
      });

      expect(result.current.status).toBe('playing');

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.timeElapsed).toBe(1);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.timeElapsed).toBe(3);
    }
  });

  it('resets game state correctly', () => {
    const wrapper = createGameLogicProviderWrapper();
    const { result } = renderHook(() => useGameLogic(), { wrapper });

    const firstCard = result.current.cards[0];
    expect(firstCard).toBeDefined();

    if (firstCard) {
      act(() => {
        result.current.handleCardClick(firstCard);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.moves).toBe(0);
      expect(result.current.timeElapsed).toBe(0);
      expect(result.current.selectedCards).toHaveLength(0);
    }
  });

  it('cleans up timers when unmounting', () => {
    const wrapper = createGameLogicProviderWrapper();
    const { result, unmount } = renderHook(() => useGameLogic(), { wrapper });

    const firstCard = result.current.cards[0];
    expect(firstCard).toBeDefined();

    if (firstCard) {
      act(() => {
        result.current.handleCardClick(firstCard);
      });
    }

    unmount();

    // Advancing timers after unmount should not throw or cause state updates
    expect(() => {
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    }).not.toThrow();
  });
});
