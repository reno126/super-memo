import React from 'react';
import { useAppSelector } from '../store/hooks';

// ToDo: any better solution?
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const ScorePanel = React.memo(() => {
  const { moves, timeElapsed, status } = useAppSelector(state => state.game);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 mb-6"
      role="region"
      aria-label="Statystyki gry"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-1" id="moves-label">
            Ruchy
          </h2>
          <p className="text-2xl font-bold text-blue-600" aria-labelledby="moves-label">
            {moves}
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-1" id="time-label">
            Czas
          </h2>
          <p
            className="text-2xl font-bold text-blue-600"
            aria-labelledby="time-label"
            aria-live="polite"
          >
            {formatTime(timeElapsed)}
          </p>
        </div>
      </div>

      {status === 'completed' && (
        <div className="mt-4 text-center" role="alert" aria-live="polite">
          <p className="text-lg font-bold text-green-600">Gratulacje! Ukończyłeś grę!</p>
          <p className="text-sm text-gray-600">
            Twój wynik: {moves} ruchów w czasie {formatTime(timeElapsed)}
          </p>
        </div>
      )}
    </div>
  );
});

ScorePanel.displayName = 'DisplayName';

export default ScorePanel;
