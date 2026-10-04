import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { Game } from '../components/Game';
import { createTestStore } from '../utils/testUtils';

describe('Game Component', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders complete game layout with board, scores, and title', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /memory game/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nowa gra/i })).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /panel wyników gry/i })).toHaveTextContent('Ruchy0');
    expect(screen.getByRole('region', { name: /panel wyników gry/i })).toHaveTextContent(
      'Czas0:00'
    );
  });

  it('allows clicking a card to initiate game play', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    const firstCard = screen.getByRole('button', { name: /karta 1, odwrócona/i });
    await user.click(firstCard);
    expect(store.getState().game.status).toBe('playing');
  });

  it('shows victory after matching every pair and restarts a fresh game', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <Game />
      </Provider>
    );
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const cardsGroupedByValue = new Map<string, number[]>();

    store.getState().game.cards.forEach(card => {
      const matchingCardPositions = cardsGroupedByValue.get(card.value) ?? [];
      matchingCardPositions.push(card.position);
      cardsGroupedByValue.set(card.value, matchingCardPositions);
    });

    for (const matchingCardPositions of cardsGroupedByValue.values()) {
      const firstCardPosition = matchingCardPositions[0];
      const secondCardPosition = matchingCardPositions[1];
      if (firstCardPosition === undefined || secondCardPosition === undefined) {
        throw new Error('Expected every card value to occur in a pair.');
      }

      await user.click(
        screen.getByRole('button', {
          name: new RegExp(`Karta ${firstCardPosition + 1}, odwrócona`, 'i'),
        })
      );
      await user.click(
        screen.getByRole('button', {
          name: new RegExp(`Karta ${secondCardPosition + 1}, odwrócona`, 'i'),
        })
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(store.getState().game.status).toBe('completed');

    await user.click(screen.getByRole('button', { name: /zagraj ponownie/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(store.getState().game.status).toBe('idle');
    expect(store.getState().game.moves).toBe(0);
    expect(store.getState().game.timeElapsed).toBe(0);
    expect(store.getState().game.selectedCards).toHaveLength(0);
    expect(store.getState().game.cards).toHaveLength(16);
    expect(store.getState().game.cards.every(card => card.state === 'hidden')).toBe(true);
    expect(screen.getAllByRole('gridcell')).toHaveLength(16);
  });
});
