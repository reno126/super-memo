import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { flipCard, initializeGame, resetGame } from '../store/gameSlice';
import { CardData } from '../types/game';
import { initialCards } from '../data/initialCards';

export const useGameLogic = () => {
  const dispatch = useAppDispatch();
  const { cards, status, selectedCards, boardSize, moves, timeElapsed } = useAppSelector(
    state => state.game
  );

  useEffect(() => {
    dispatch(initializeGame(initialCards));
  }, [dispatch]);

  const handleCardClick = (clickedCard: CardData) => {
    dispatch(flipCard(clickedCard.id));
  };

  const handleReset = () => {
    dispatch(resetGame());
  };

  return {
    cards,
    status,
    selectedCards,
    boardSize,
    moves,
    timeElapsed,
    handleCardClick,
    resetGame: handleReset,
  };
};
