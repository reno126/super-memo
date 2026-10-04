import { useGameLogic } from '../hooks/useGameLogic';
import { GameLayout } from './GameLayout';

export function Game() {
  const { cards, status, selectedCards, boardSize, handleCardClick } = useGameLogic();

  return (
    <GameLayout
      cards={cards}
      boardSize={boardSize}
      onCardClick={handleCardClick}
      disabledCards={status === 'completed' || selectedCards.length === 2}
    />
  );
}

export default Game;
