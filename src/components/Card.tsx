import { CardData } from '../types/game';

interface CardProps {
  card: CardData;
  onCardClick: (card: CardData) => void;
  disabled: boolean;
}

export const Card = ({ card, onCardClick, disabled }: CardProps) => {
  const getCardClasses = () => {
    const baseClasses =
      'w-24 h-32 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200';

    switch (card.state) {
      case 'hidden':
        return `${baseClasses} bg-blue-500 text-transparent`;
      case 'revealed':
        return `${baseClasses} bg-white text-blue-900 border-2 border-blue-500`;
      case 'matched':
        return `${baseClasses} bg-green-100 text-green-900 border-2 border-green-500`;
      default:
        return baseClasses;
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onCardClick(card);
    }
  };

  return (
    <button
      className={getCardClasses()}
      onClick={handleClick}
      disabled={disabled}
      data-testid={`card-${card.id}`}
    >
      <div className="flex items-center justify-center w-full h-full text-2xl font-bold">
        {card.state !== 'hidden' ? card.value : '?'}
      </div>
    </button>
  );
};

export default Card;
