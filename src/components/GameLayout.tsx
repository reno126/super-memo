import React from 'react';
import { CardData, BoardSize } from '../types/game';
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

export const GameLayout: React.FC<GameLayoutProps> = ({
  cards,
  boardSize,
  onCardClick,
  disabledCards,
}) => (
  <div className="min-h-screen bg-gray-200 py-6 flex flex-col justify-center">
    <div className="relative py-3 max-w-xl mx-auto">
      <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900" data-testid="game-title">
            Memory Game
          </h1>
          <ResetButton />
        </div>
        <ScorePanel />
        <Board
          {...{
            cards,
            boardSize,
            onCardClick,
            disabledCards,
          }}
        />
      </div>
    </div>
    <VictoryModal />
  </div>
);
