import React from 'react';
import { CardData, BoardSize } from '../types/game';
import Card from './Card';

interface BoardProps {
  cards: CardData[];
  boardSize: BoardSize;
  onCardClick: (card: CardData) => void;
  disabledCards: boolean;
}

const Board: React.FC<BoardProps> = ({ cards, boardSize, onCardClick, disabledCards }) => {
  // Obliczamy style dla kontenera planszy na podstawie rozmiaru
  const getBoardStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${boardSize.cols}, minmax(0, 1fr))`,
      gap: '1rem',
    };
  };

  return (
    <div
      className={`w-full max-w-4xl p-4 grid gap-4 grid-cols-${boardSize.cols} grid-rows-${boardSize.rows}`}
      style={getBoardStyle()}
      role="grid"
      data-testid="game-board"
    >
      {cards.map(card => (
        <div key={card.id} role="gridcell">
          <Card card={card} onCardClick={onCardClick} disabled={disabledCards} />
        </div>
      ))}
    </div>
  );
};

export default Board;
