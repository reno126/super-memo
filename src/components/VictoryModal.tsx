import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { resetGame } from '../store/gameSlice';
import { formatTime } from '../utils/dateTimeUtils';

const VictoryModal: React.FC = () => {
  const { status, moves, timeElapsed } = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  const handlePlayAgain = () => {
    dispatch(resetGame());
  };

  if (status !== 'completed') return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        role="dialog"
      >
        <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl" role="document">
          <div className="transform transition-all duration-200">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-4" id="victory-title">
              Gratulacje!
            </h2>

            <div className="text-center mb-6">
              <p className="text-gray-700 mb-2">
                Ukończyłeś grę w czasie {formatTime(timeElapsed)}!
              </p>
              <p className="text-gray-700">Liczba wykonanych ruchów: {moves}</p>
            </div>

            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              onClick={handlePlayAgain}
            >
              Zagraj ponownie
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VictoryModal;
