import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../setupTests';
import { Provider } from 'react-redux';
import VictoryModal from '../components/VictoryModal';
import { createMockStore, createTestGameState } from '../utils/testUtils';

describe('VictoryModal Component', () => {
  it('renders victory message when game is completed', () => {
    const store = createMockStore(
      createTestGameState({
        status: 'completed',
        moves: 10,
        timeElapsed: 65,
      })
    );

    render(
      <Provider store={store}>
        <VictoryModal />
      </Provider>
    );

    const victoryDialog = screen.getByRole('dialog', { name: /gratulacje/i });
    expect(victoryDialog).toBeInTheDocument();
    expect(victoryDialog.textContent).toContain('1:05');
    expect(victoryDialog.textContent).toContain('10');
  });

  it('does not render when game is not completed', () => {
    const store = createMockStore(
      createTestGameState({
        status: 'playing',
        moves: 5,
        timeElapsed: 30,
      })
    );

    render(
      <Provider store={store}>
        <VictoryModal />
      </Provider>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles play again button click', async () => {
    const user = userEvent.setup();
    const store = createMockStore(
      createTestGameState({
        status: 'completed',
        moves: 10,
        timeElapsed: 60,
      })
    );

    render(
      <Provider store={store}>
        <VictoryModal />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /zagraj ponownie/i }));

    const state = store.getState();
    expect(state.game.status).toBe('idle');
    expect(state.game.moves).toBe(0);
    expect(state.game.timeElapsed).toBe(0);
  });
});
