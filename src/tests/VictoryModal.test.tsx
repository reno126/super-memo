import { render, fireEvent, screen } from '@testing-library/react';
import '../setupTests';
import { Provider } from 'react-redux';
import VictoryModal from '../components/VictoryModal';
import { createMockStore } from '../utils/testUtils';

describe('VictoryModal Component', () => {
  it('renders victory message when game is completed', () => {
    const store = createMockStore({
      status: 'completed',
      moves: 10,
      timeElapsed: 65,
    });

    render(
      <Provider store={store}>
        <VictoryModal />
      </Provider>
    );

    expect(screen.getByTestId('victory-title')).toBeInTheDocument();
    expect(screen.getByTestId('victory-time-message')).toHaveTextContent(
      'Ukończyłeś grę w czasie 1:05!'
    );
    expect(screen.getByTestId('victory-moves-message')).toHaveTextContent(
      'Liczba wykonanych ruchów: 10'
    );
  });

  it('does not render when game is not completed', () => {
    const store = createMockStore({
      status: 'playing',
      moves: 5,
      timeElapsed: 30,
    });

    const { container } = render(
      <Provider store={store}>
        <VictoryModal />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('handles play again button click', () => {
    const store = createMockStore({
      status: 'completed',
      moves: 10,
      timeElapsed: 60,
    });

    render(
      <Provider store={store}>
        <VictoryModal />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('play-again-button'));

    const state = store.getState();
    expect(state.game.status).toBe('idle');
    expect(state.game.moves).toBe(0);
    expect(state.game.timeElapsed).toBe(0);
  });
});
