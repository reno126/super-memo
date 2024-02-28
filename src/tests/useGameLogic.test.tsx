import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react';
import { Provider } from 'react-redux';
import { useGameLogic } from '../hooks/useGameLogic';
import { createMockStore } from '../utils/testUtils';
import { CardData } from '../types/game';

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

    const mockCard: CardData = {
      id: 1,
      value: 'A',
      state: 'hidden',
      position: 0,
    };

    act(() => {
      result.current.handleCardClick(mockCard);
    });

    expect(result.current.selectedCards).toContain(mockCard.id);
    expect(result.current.status).toBe('playing');
  });

  it('updates game status when selecting two cards', () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper });

    const firstCard: CardData = {
      id: 1,
      value: 'A',
      state: 'hidden',
      position: 0,
    };

    const secondCard: CardData = {
      id: 2,
      value: 'A',
      state: 'hidden',
      position: 1,
    };

    act(() => {
      result.current.handleCardClick(firstCard);
      result.current.handleCardClick(secondCard);
    });

    expect(result.current.selectedCards).toHaveLength(2);
    expect(result.current.moves).toBe(1);
    expect(result.current.status).toBe('checking');
  });

  it('handles timer updates correctly', () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper });

    // game start
    act(() => {
      result.current.handleCardClick({
        id: 1,
        value: 'A',
        state: 'hidden',
        position: 0,
      });
    });

    expect(result.current.status).toBe('playing');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.timeElapsed).toBe(1);
  });

  it('resets game state correctly', () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper });

    // game start
    act(() => {
      result.current.handleCardClick({
        id: 1,
        value: 'A',
        state: 'hidden',
        position: 0,
      });
    });

    // reset ganme
    act(() => {
      result.current.resetGame();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.moves).toBe(0);
    expect(result.current.timeElapsed).toBe(0);
    expect(result.current.selectedCards).toHaveLength(0);
  });
});
