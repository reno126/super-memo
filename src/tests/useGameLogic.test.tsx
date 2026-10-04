import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useGameLogic } from '../hooks/useGameLogic';
import { createTestStore } from '../utils/testUtils';
import { findMatchingCardPair, findNonMatchingCardPair } from './fixtures/gameFixtures';

function createGameLogicProviderWrapper(store: ReturnType<typeof createTestStore>) {
  return function GameLogicProviderWrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

function renderGameLogic() {
  const store = createTestStore();
  const wrapper = createGameLogicProviderWrapper(store);
  const hook = renderHook(() => useGameLogic(), { wrapper });

  return { ...hook, store };
}

describe('useGameLogic Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes game state correctly', () => {
    const { result } = renderGameLogic();

    expect(result.current.cards).toHaveLength(16);
    expect(result.current.status).toBe('idle');
    expect(result.current.selectedCards).toHaveLength(0);
    expect(result.current.boardSize).toEqual({ rows: 4, cols: 4 });
    expect(result.current.moves).toBe(0);
    expect(result.current.timeElapsed).toBe(0);
  });

  it('starts the timer on the first card and updates it at one-second boundaries', () => {
    const { result } = renderGameLogic();
    const [firstCard] = findNonMatchingCardPair(result.current.cards);

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.timeElapsed).toBe(0);

    act(() => {
      result.current.handleCardClick(firstCard);
    });

    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(result.current.timeElapsed).toBe(0);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.timeElapsed).toBe(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.timeElapsed).toBe(3);
  });

  it('matches a selected pair after one second', () => {
    const { result } = renderGameLogic();
    const [firstCard, secondCard] = findMatchingCardPair(result.current.cards);

    act(() => {
      result.current.handleCardClick(firstCard);
      result.current.handleCardClick(secondCard);
    });

    expect(result.current.selectedCards).toHaveLength(2);
    expect(result.current.moves).toBe(1);
    expect(result.current.status).toBe('checking');

    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(result.current.status).toBe('checking');
    const revealedPairCards = result.current.cards.filter(card =>
      [firstCard.id, secondCard.id].includes(card.id)
    );
    expect(revealedPairCards.every(card => card.state === 'revealed')).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    const matchedCardIds = new Set([firstCard.id, secondCard.id]);
    const matchedCards = result.current.cards.filter(card => matchedCardIds.has(card.id));
    expect(matchedCards.every(card => card.state === 'matched')).toBe(true);
    expect(result.current.selectedCards).toHaveLength(0);
    expect(result.current.status).toBe('playing');
  });

  it('hides a selected non-matching pair after one second', () => {
    const { result } = renderGameLogic();
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

  it('stops the timer and cancels pending pair resolution when reset', () => {
    const { result } = renderGameLogic();
    const [firstCard, secondCard] = findMatchingCardPair(result.current.cards);

    act(() => {
      result.current.handleCardClick(firstCard);
      result.current.handleCardClick(secondCard);
    });

    expect(result.current.status).toBe('checking');
    act(() => {
      jest.advanceTimersByTime(400);
      result.current.resetGame();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.moves).toBe(0);
    expect(result.current.timeElapsed).toBe(0);
    expect(result.current.selectedCards).toHaveLength(0);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.timeElapsed).toBe(0);
    expect(result.current.selectedCards).toHaveLength(0);
    expect(result.current.cards.every(card => card.state === 'hidden')).toBe(true);
  });

  it('stops the timer after every pair is matched', () => {
    const { result } = renderGameLogic();
    const cardValues = [...new Set(result.current.cards.map(card => card.value))];

    cardValues.forEach(cardValue => {
      const matchingCards = result.current.cards.filter(card => card.value === cardValue);
      const firstCard = matchingCards[0];
      const secondCard = matchingCards[1];
      if (!firstCard || !secondCard) {
        throw new Error('Expected each card value to have a matching pair.');
      }

      act(() => {
        result.current.handleCardClick(firstCard);
        result.current.handleCardClick(secondCard);
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });
    });

    expect(result.current.status).toBe('completed');
    expect(result.current.cards.every(card => card.state === 'matched')).toBe(true);
    const completedTimeElapsed = result.current.timeElapsed;

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.timeElapsed).toBe(completedTimeElapsed);
    expect(result.current.status).toBe('completed');
  });

  it('clears pending timers when unmounted', () => {
    const { result, store, unmount } = renderGameLogic();
    const [firstCard, secondCard] = findMatchingCardPair(result.current.cards);

    act(() => {
      result.current.handleCardClick(firstCard);
      result.current.handleCardClick(secondCard);
      jest.advanceTimersByTime(400);
    });

    unmount();
    const stateAtUnmount = store.getState().game;

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(store.getState().game).toEqual(stateAtUnmount);
    expect(jest.getTimerCount()).toBe(0);
  });
});
