import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    const board = screen.getByRole('grid');
    expect(board).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell')).toHaveLength(mockCards.length);
  });

  it('handles card clicks correctly', async () => {
    const user = userEvent.setup();
    render(
      <Board
        cards={mockCards}
        boardSize={mockBoardSize}
        onCardClick={mockOnCardClick}
        disabledCards={false}
      />
    );

    const firstCard = screen.getByRole('button', { name: /karta 1, odwrócona/i });
    await user.click(firstCard);
    expect(mockOnCardClick).toHaveBeenCalledWith(mockCards[0]);
    expect(mockOnCardClick).toHaveBeenCalledTimes(1);
  });

  it('disables all cards when disabledCards is true', async () => {
    const user = userEvent.setup();
    render(
      <Board
        cards={mockCards}
        boardSize={mockBoardSize}
        onCardClick={mockOnCardClick}
        disabledCards={true}
      />
    );

    const firstCard = screen.getByRole('button', { name: /karta 1, odwrócona/i });
    expect(firstCard).toHaveAttribute('disabled');
    await user.click(firstCard);
    expect(mockOnCardClick).not.toHaveBeenCalled();
  });
});
