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

    expect(screen.getByText('Gratulacje!')).toBeInTheDocument();
    expect(screen.getByText('Ukończyłeś grę w czasie 1:05!')).toBeInTheDocument();
    expect(screen.getByText('Liczba wykonanych ruchów: 10')).toBeInTheDocument();
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

    fireEvent.click(screen.getByText('Zagraj ponownie'));

    const state = store.getState();
    expect(state.game.status).toBe('idle');
    expect(state.game.moves).toBe(0);
    expect(state.game.timeElapsed).toBe(0);
  });
});
