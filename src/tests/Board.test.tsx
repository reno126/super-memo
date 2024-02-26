import { render, screen, fireEvent } from '@testing-library/react';
import Board from '../components/Board';
import { CardData, BoardSize } from '../types/game';

describe('Board Component', () => {
  const mockCards: CardData[] = [
    { id: 1, value: 'A', state: 'hidden', position: 0 },
    { id: 2, value: 'B', state: 'hidden', position: 1 },
    { id: 3, value: 'C', state: 'hidden', position: 2 },
    { id: 4, value: 'D', state: 'hidden', position: 3 },
  ];

  const mockBoardSize: BoardSize = { rows: 2, cols: 2 };
  const mockOnCardClick = jest.fn();

  beforeEach(() => {
    mockOnCardClick.mockClear();
  });

  it('renders all cards in a grid', () => {
    render(
      <Board
        cards={mockCards}
        boardSize={mockBoardSize}
        onCardClick={mockOnCardClick}
        disabledCards={false}
      />
    );

    const cards = screen.getAllByRole('button');
    expect(cards).toHaveLength(4);

    const board = screen.getByTestId('game-board');
    expect(board).toBeInTheDocument();
    expect(board.children).toHaveLength(4);
  });

  it('handles card clicks correctly', () => {
    render(
      <Board
        cards={mockCards}
        boardSize={mockBoardSize}
        onCardClick={mockOnCardClick}
        disabledCards={false}
      />
    );

    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);

    expect(mockOnCardClick).toHaveBeenCalledWith(mockCards[0]);
    expect(mockOnCardClick).toHaveBeenCalledTimes(1);
  });

  it('disables all cards when disabledCards is true', () => {
    render(
      <Board
        cards={mockCards}
        boardSize={mockBoardSize}
        onCardClick={mockOnCardClick}
        disabledCards={true}
      />
    );

    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);

    expect(mockOnCardClick).not.toHaveBeenCalled();
  });

  it('applies correct grid layout based on board size', () => {
    render(
      <Board
        cards={mockCards}
        boardSize={mockBoardSize}
        onCardClick={mockOnCardClick}
        disabledCards={false}
      />
    );

    const board = screen.getByTestId('game-board');
    expect(board).toHaveClass('grid-cols-2 grid-rows-2');
  });
});
