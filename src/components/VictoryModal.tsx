import { useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { resetGame } from '../store/gameSlice';
import { formatTime } from '../utils/dateTimeUtils';

function VictoryContent() {
  const moves = useAppSelector(state => state.game.moves);
  const timeElapsed = useAppSelector(state => state.game.timeElapsed);
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handlePlayAgain = useCallback(() => {
    dispatch(resetGame());
  }, [dispatch]);
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
    >
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl" role="document">
        <div className="transform transition-all duration-200">
          <h2
            className="text-2xl font-bold text-center text-green-600 mb-4"
            id="victory-title"
            data-testid="victory-title"
            tabIndex={-1}
            ref={titleRef}
          >
            Gratulacje!
          </h2>

          <div className="text-center mb-6">
            <p className="text-gray-700 mb-2" data-testid="victory-time-message">
              Ukończyłeś grę w czasie {formatTime(timeElapsed)}!
            </p>
            <p className="text-gray-700" data-testid="victory-moves-message">
              Liczba wykonanych ruchów: {moves}
            </p>
          </div>

          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={handlePlayAgain}
            data-testid="play-again-button"
          >
            Zagraj ponownie
          </button>
        </div>
      </div>
    </div>
  );
}

export function VictoryModal() {
  const status = useAppSelector(state => state.game.status);

  if (status !== 'completed') {
    return null;
  }

  return <VictoryContent />;
}

export default VictoryModal;
