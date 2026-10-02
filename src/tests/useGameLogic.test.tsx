import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useGameLogic } from '../hooks/useGameLogic';
import { createMockStore } from '../utils/testUtils';

describe('useGameLogic Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={createMockStore()}>{children}</Provider>
  );

  it('initializes game state correctly', () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper });

    expect(result.current.cards).toHaveLength(16);
    expect(result.current.status).toBe('idle');
    expect(result.current.selectedCards).toHaveLength(0);
    expect(result.current.boardSize).toEqual({ rows: 4, cols: 4 });
    expect(result.current.moves).toBe(0);
    expect(result.current.timeElapsed).toBe(0);
  });

  it('handles card click correctly', () => {
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

  it('updates game status when selecting two cards and resolves match after 1 second', () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper });

    const firstCard = result.current.cards[0];
    const secondCard = result.current.cards[1];
    expect(firstCard).toBeDefined();
    expect(secondCard).toBeDefined();

    if (firstCard && secondCard) {
      act(() => {
        result.current.handleCardClick(firstCard);
      });
      act(() => {
        result.current.handleCardClick(secondCard);
      });

      expect(result.current.selectedCards).toHaveLength(2);
      expect(result.current.moves).toBe(1);
      expect(result.current.status).toBe('checking');

      // Fast-forward 1000ms delay for checkMatch
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.selectedCards).toHaveLength(0);
      expect(result.current.status).toBe('playing');
    }
  });

  it('handles timer updates correctly during play', () => {
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
