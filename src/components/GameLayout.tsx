import React from 'react';
import { CardData, BoardSize } from '../types/game';
import Board from './Board';

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
  <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div className="max-w-md mx-auto">
          <div className="divide-y divide-gray-200">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Memory Game</h1>
              </div>
              <Board
                {...{
                  cards,
                  boardSize,
                  onCardClick,
                  disabledCards
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
