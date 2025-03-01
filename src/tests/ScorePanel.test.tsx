import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ScorePanel from '../components/ScorePanel';
import { createMockStore } from '../utils/testUtils';

describe('ScorePanel Component', () => {
  it('displays correct moves count', () => {
    const store = createMockStore({
      moves: 5,
      status: 'playing',
      timeElapsed: 0,
      cards: [],
      selectedCards: [],
      boardSize: { rows: 4, cols: 4 },
    });

    render(
      <Provider store={store}>
        <ScorePanel />
      </Provider>
    );

    expect(screen.getByTestId('moves-label')).toBeInTheDocument();
    expect(screen.getByTestId('moves-value')).toHaveTextContent('5');
  });

  it('displays formatted time correctly', () => {
    const store = createMockStore({
      moves: 0,
      status: 'playing',
      timeElapsed: 65,
      cards: [],
      selectedCards: [],
      boardSize: { rows: 4, cols: 4 },
    });

    render(
      <Provider store={store}>
        <ScorePanel />
      </Provider>
    );

    expect(screen.getByTestId('time-label')).toBeInTheDocument();
    expect(screen.getByTestId('time-value')).toHaveTextContent('1:05');
  });

  it('shows zero values for new game', () => {
    const store = createMockStore({
      moves: 0,
      status: 'idle',
      timeElapsed: 0,
      cards: [],
      selectedCards: [],
      boardSize: { rows: 4, cols: 4 },
    });

    render(
      <Provider store={store}>
        <ScorePanel />
      </Provider>
    );

    expect(screen.getByTestId('moves-label')).toBeInTheDocument();
    expect(screen.getByTestId('moves-value')).toHaveTextContent('0');
    expect(screen.getByTestId('time-value')).toHaveTextContent('0:00');
  });

  it('formats time with leading zeros', () => {
    const store = createMockStore({
      moves: 0,
      status: 'playing',
      timeElapsed: 305,
      cards: [],
      selectedCards: [],
      boardSize: { rows: 4, cols: 4 },
    });

    render(
      <Provider store={store}>
        <ScorePanel />
      </Provider>
    );

    expect(screen.getByTestId('time-value')).toHaveTextContent('5:05');
  });
});
