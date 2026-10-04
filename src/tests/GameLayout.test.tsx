import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('renders accessible game controls and the supplied cards', async () => {
    const user = userEvent.setup();
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

    expect(screen.getByRole('heading', { name: /memory game/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nowa gra/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /panel wyników gry/i })).toHaveTextContent('Ruchy');
    expect(screen.getByRole('region', { name: /panel wyników gry/i })).toHaveTextContent('Czas');
    expect(screen.getAllByRole('gridcell')).toHaveLength(mockCards.length);
    const firstCard = screen.getByRole('button', { name: /karta 1, odwrócona/i });
    await user.click(firstCard);
    expect(mockOnCardClick).toHaveBeenCalledWith(mockCards[0]);
  });
});
