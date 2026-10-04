import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ScorePanel from '../components/ScorePanel';
import { createTestStore, createTestGameState } from '../utils/testUtils';

describe('ScorePanel Component', () => {
  it('displays correct moves count', () => {
    const store = createTestStore(
      createTestGameState({
        moves: 5,
        status: 'playing',
        timeElapsed: 0,
        cards: [],
        selectedCards: [],
        boardSize: { rows: 4, cols: 4 },
      })
    );

    render(
      <Provider store={store}>
        <ScorePanel />
      </Provider>
    );

    const scorePanel = screen.getByRole('region', { name: /panel wyników gry/i });
    expect(scorePanel).toHaveTextContent('Ruchy5');
  });

  it('displays formatted time correctly', () => {
    const store = createTestStore(
      createTestGameState({
        moves: 0,
        status: 'playing',
        timeElapsed: 65,
        cards: [],
        selectedCards: [],
        boardSize: { rows: 4, cols: 4 },
      })
    );

    render(
      <Provider store={store}>
        <ScorePanel />
      </Provider>
    );

    expect(screen.getByRole('region', { name: /panel wyników gry/i })).toHaveTextContent(
      'Czas1:05'
    );
  });

  it('shows zero values for new game', () => {
    const store = createTestStore(
      createTestGameState({
        moves: 0,
        status: 'idle',
        timeElapsed: 0,
        cards: [],
        selectedCards: [],
        boardSize: { rows: 4, cols: 4 },
      })
    );

    render(
      <Provider store={store}>
        <ScorePanel />
      </Provider>
    );

    const scorePanel = screen.getByRole('region', { name: /panel wyników gry/i });
    expect(scorePanel).toHaveTextContent('Ruchy0');
    expect(scorePanel).toHaveTextContent('Czas0:00');
  });

  it('formats time with leading zeros', () => {
    const store = createTestStore(
      createTestGameState({
        moves: 0,
        status: 'playing',
        timeElapsed: 305,
        cards: [],
        selectedCards: [],
        boardSize: { rows: 4, cols: 4 },
      })
    );

    render(
      <Provider store={store}>
        <ScorePanel />
      </Provider>
    );

    expect(screen.getByRole('region', { name: /panel wyników gry/i })).toHaveTextContent(
      'Czas5:05'
    );
  });
});
