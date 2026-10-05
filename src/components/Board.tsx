import React, { useMemo } from 'react';
import { CardData, BoardSize } from '../types/game';
import Card from './Card';

interface BoardProps {
  cards: CardData[];
  boardSize: BoardSize;
  onCardClick: (card: CardData) => void;
  disabledCards: boolean;
}

export function Board({ cards, boardSize, onCardClick, disabledCards }: BoardProps) {
  const boardStyle = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${boardSize.cols}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${boardSize.rows}, minmax(0, 1fr))`,
    }),
    [boardSize.cols, boardSize.rows]
  );

  return (
    <div
      className="w-full max-w-4xl min-w-0 p-2 sm:p-4 grid gap-2 sm:gap-4"
      style={boardStyle}
      role="grid"
      data-testid="game-board"
    >
      {cards.map(card => (
        <div key={card.id} role="gridcell" className="min-w-0">
          <Card card={card} onCardClick={onCardClick} disabled={disabledCards} />
        </div>
      ))}
    </div>
  );
}

export default Board;
