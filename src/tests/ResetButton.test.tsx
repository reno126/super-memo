import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ResetButton } from '../components/ResetButton';
import { createMockStore, createTestGameState } from '../utils/testUtils';

describe('ResetButton Component', () => {
  it('renders correctly and dispatches resetGame when clicked', () => {
    const store = createMockStore(
      createTestGameState({
        moves: 4,
        status: 'playing',
        timeElapsed: 25,
      })
    );

    render(
      <Provider store={store}>
        <ResetButton />
      </Provider>
    );

    const button = screen.getByTestId('reset-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Nowa Gra');

    userEvent.click(button);

    const state = store.getState();
    expect(state.game.status).toBe('idle');
    expect(state.game.moves).toBe(0);
    expect(state.game.timeElapsed).toBe(0);
  });
});
