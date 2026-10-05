import { CardData, BoardSize } from '../types/game';
import logo from '../logo.svg';
import Board from './Board';
import ResetButton from './ResetButton';
import ScorePanel from './ScorePanel';
import VictoryModal from './VictoryModal';

interface GameLayoutProps {
  cards: CardData[];
  boardSize: BoardSize;
  onCardClick: (card: CardData) => void;
  disabledCards: boolean;
}

export function GameLayout({ cards, boardSize, onCardClick, disabledCards }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cyan/20 via-white to-brand-purple/20 px-4 py-8 flex flex-col justify-center">
      <div className="relative w-full max-w-xl mx-auto">
        <header className="mb-5 flex flex-col md:flex-row justify-center items-center gap-3">
          <img className="h-20 w-20 rounded-2xl shadow-lg" src={logo} alt="Super Memo" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Super Memo</h1>
            <h2 className="text-sm text-gray-400">Simple memory game</h2>
          </div>
        </header>
        <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <ResetButton />
          </div>
          <ScorePanel />
          <Board
            cards={cards}
            boardSize={boardSize}
            onCardClick={onCardClick}
            disabledCards={disabledCards}
          />
        </div>
      </div>
      <VictoryModal />
    </div>
  );
}

export default GameLayout;
