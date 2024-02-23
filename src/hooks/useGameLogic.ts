import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkMatch, flipCard, initializeGame, resetGame, updateTimer } from '../store/gameSlice';
import { CardData } from '../types/game';
import { initialCards } from '../data/initialCards';

export const useGameLogic = () => {
  const dispatch = useAppDispatch();
  const { cards, status, selectedCards, boardSize, moves, timeElapsed } = useAppSelector(
    state => state.game
  );
  const gameStartedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    dispatch(initializeGame(initialCards));
  }, [dispatch]);

  useEffect(() => {
    const isGameInProgress = status !== 'idle' && status !== 'completed';

    (function startTimer() {
      if (isGameInProgress && !gameStartedRef.current) {
        gameStartedRef.current = true;
        timerRef.current = setInterval(() => {
          dispatch(updateTimer());
        }, 1000);
      }
    })();

    (function stopTimer() {
      if (!isGameInProgress && gameStartedRef.current) {
        gameStartedRef.current = false;
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    })();
  }, [status, dispatch]);

  useEffect(() => {
    (function checkMatchDelay() {
      if (selectedCards.length === 2) {
        const timer = setTimeout(() => {
          dispatch(checkMatch());
        }, 1000);
        return () => clearTimeout(timer);
      }
    })();
  }, [selectedCards, dispatch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
