import { useAppDispatch } from '../store/hooks';
import { resetGame } from '../store/gameSlice';

export function ResetButton() {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetGame());
  };

  return (
    <button
      className="bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-opacity-50"
      onClick={handleReset}
      data-testid="reset-button"
    >
      Nowa Gra
    </button>
  );
}

export default ResetButton;
