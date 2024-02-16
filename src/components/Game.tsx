import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameLayout } from './GameLayout';

export const Game: React.FC = () => {
  const { cards, status, selectedCards, boardSize, handleCardClick } = useGameLogic();

  return (
    <GameLayout
      cards={cards}
      boardSize={boardSize}
      onCardClick={handleCardClick}
      disabledCards={false}
    />
  );
};
