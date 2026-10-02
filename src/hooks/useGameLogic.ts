import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkMatch, flipCard, initializeGame, resetGame, updateTimer } from '../store/gameSlice';
import { CardData } from '../types/game';
import { initialCards } from '../data/initialCards';

export const useGameLogic = () => {
  const dispatch = useAppDispatch();
  const cards = useAppSelector(state => state.game.cards);
  const status = useAppSelector(state => state.game.status);
  const selectedCards = useAppSelector(state => state.game.selectedCards);
  const boardSize = useAppSelector(state => state.game.boardSize);
  const moves = useAppSelector(state => state.game.moves);
  const timeElapsed = useAppSelector(state => state.game.timeElapsed);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    dispatch(initializeGame(initialCards));
  }, [dispatch]);

  useEffect(() => {
    const isGameInProgress = status !== 'idle' && status !== 'completed';

    if (isGameInProgress) {
      timerRef.current = setInterval(() => {
        dispatch(updateTimer());
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedCards.length !== 2) return;

    const timeoutIdentifier = setTimeout(() => {
      dispatch(checkMatch());
    }, 1000);

    return () => {
      clearTimeout(timeoutIdentifier);
    };
  }, [selectedCards, dispatch]);

  const handleCardClick = useCallback(
    (clickedCard: CardData) => {
      dispatch(flipCard(clickedCard.id));
    },
    [dispatch]
  );

  const handleReset = useCallback(() => {
    dispatch(resetGame());
  }, [dispatch]);

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
