import React from 'react';
import { useAppSelector } from '../store/hooks';
import { formatTime } from '../utils/dateTimeUtils';

const ScorePanel = React.memo(() => {
  const { moves, timeElapsed } = useAppSelector(state => state.game);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6" role="region">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <h2
            className="text-lg font-semibold text-gray-700 mb-1"
            id="moves-label"
            data-testid="moves-label"
          >
            Ruchy
          </h2>
          <p className="text-2xl font-bold text-blue-600" data-testid="moves-value">
            {moves}
          </p>
        </div>

        <div className="text-center">
          <h2
            className="text-lg font-semibold text-gray-700 mb-1"
            id="time-label"
            data-testid="time-label"
          >
            Czas
          </h2>
          <p className="text-2xl font-bold text-blue-600" data-testid="time-value">
            {formatTime(timeElapsed)}
          </p>
        </div>
      </div>
    </div>
  );
});

ScorePanel.displayName = 'DisplayName';

export default ScorePanel;
