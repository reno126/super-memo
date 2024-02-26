import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { resetGame } from '../store/gameSlice';

const ResetButton: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetGame());
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      onClick={handleReset}
    >
      Nowa Gra
    </button>
  );
};

export default ResetButton;
