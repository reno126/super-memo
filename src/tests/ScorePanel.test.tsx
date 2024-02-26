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

    expect(screen.getByText('Ruchy')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
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

    expect(screen.getByText('Czas')).toBeInTheDocument();
    expect(screen.getByText('1:05')).toBeInTheDocument();
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

    expect(screen.getByText('Ruchy')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0:00')).toBeInTheDocument();
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

    expect(screen.getByText('5:05')).toBeInTheDocument();
  });
});
