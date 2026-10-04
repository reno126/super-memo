import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { Game } from '../components/Game';
import { createMockStore } from '../utils/testUtils';

describe('Game Component', () => {
  it('renders complete game layout with board, scores, and title', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    expect(screen.getByTestId('game-title')).toHaveTextContent('Memory Game');
    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    expect(screen.getByTestId('game-board')).toBeInTheDocument();
    expect(screen.getByTestId('moves-value')).toHaveTextContent('0');
    expect(screen.getByTestId('time-value')).toHaveTextContent('0:00');
  });

  it('allows clicking a card to initiate game play', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    const cards = screen.getAllByRole('button');
    const firstCard = cards[1]; // first board card (after reset button)
    expect(firstCard).toBeDefined();

    if (firstCard) {
      await user.click(firstCard);
      const state = store.getState();
      expect(state.game.status).toBe('playing');
    }
  });
});
