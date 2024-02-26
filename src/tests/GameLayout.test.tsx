import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { GameLayout } from '../components/GameLayout';
import { createMockStore } from '../utils/testUtils';
import { CardData, BoardSize } from '../types/game';

describe('GameLayout Component', () => {
  const mockCards: CardData[] = [
    { id: 1, value: 'A', state: 'hidden', position: 0 },
    { id: 2, value: 'A', state: 'hidden', position: 1 },
  ];

  const mockBoardSize: BoardSize = { rows: 2, cols: 1 };
  const mockOnCardClick = jest.fn();

  beforeEach(() => {
    mockOnCardClick.mockClear();
  });

  it('renders basic layout and board headers', () => {
    render(
      <Provider store={createMockStore()}>
        <GameLayout
          cards={mockCards}
          boardSize={mockBoardSize}
          onCardClick={mockOnCardClick}
          disabledCards={false}
        />
      </Provider>
    );

    expect(screen.getByText('Memory Game')).toBeInTheDocument();
    expect(screen.getByText('Nowa Gra')).toBeInTheDocument();
    expect(screen.getByText('Ruchy')).toBeInTheDocument();
    expect(screen.getByText('Czas')).toBeInTheDocument();
    expect(screen.getByTestId('game-board')).toBeInTheDocument();

  });
});
