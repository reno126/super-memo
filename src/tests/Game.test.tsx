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
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    const firstCard = screen.getByRole('button', { name: /karta 1, odwrócona/i });
    await user.click(firstCard);
    expect(store.getState().game.status).toBe('playing');
  });
});
