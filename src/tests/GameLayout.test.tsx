import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { GameLayout } from '../components/GameLayout';
import { createTestStore } from '../utils/testUtils';
import { CardData, BoardSize } from '../types/game';

const suppliedCards: CardData[] = [
  { id: 1, value: 'A', state: 'hidden', position: 0 },
  { id: 2, value: 'A', state: 'hidden', position: 1 },
];

const suppliedBoardSize: BoardSize = { rows: 2, cols: 1 };

describe('GameLayout Component', () => {
  it('renders supplied cards and board dimensions with working click handling', async () => {
    const user = userEvent.setup();
    const handleCardClick = jest.fn();

    render(
      <Provider store={createTestStore()}>
        <GameLayout
          cards={suppliedCards}
          boardSize={suppliedBoardSize}
          onCardClick={handleCardClick}
          disabledCards={false}
        />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /memory game/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nowa gra/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /panel wyników gry/i })).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell')).toHaveLength(suppliedCards.length);
    expect(screen.getByRole('grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
    });

    await user.click(screen.getByRole('button', { name: /karta 1, odwrócona/i }));

    expect(handleCardClick).toHaveBeenCalledWith(suppliedCards[0]);
  });

  it('disables supplied cards when the disabled state is enabled', () => {
    render(
      <Provider store={createTestStore()}>
        <GameLayout
          cards={suppliedCards}
          boardSize={suppliedBoardSize}
          onCardClick={jest.fn()}
          disabledCards={true}
        />
      </Provider>
    );

    expect(screen.getByRole('button', { name: /karta 1, odwrócona/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /karta 2, odwrócona/i })).toBeDisabled();
  });
});
