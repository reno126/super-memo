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

  it('renders basic layout', () => {
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

    const cards = screen.getAllByRole('button');

    expect(cards).toHaveLength(2);
  });

  it('handles card clicks correctly', () => {
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

    const cards = screen.getAllByRole('button');
    cards.forEach(card => {
      card.click();
    });

    expect(mockOnCardClick).toHaveBeenCalledTimes(2);
  });

  it('disables cards when disabledCards is true', () => {
    render(
      <Provider store={createMockStore()}>
        <GameLayout
          cards={mockCards}
          boardSize={mockBoardSize}
          onCardClick={mockOnCardClick}
          disabledCards={true}
        />
      </Provider>
    );

    const cards = screen.getAllByRole('button');

    cards.forEach(card => {
      card.click();
    });

    expect(mockOnCardClick).not.toHaveBeenCalled();
  });
});
