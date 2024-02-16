import { fireEvent, render, screen } from '@testing-library/react';
import '../setupTests';
import { Card } from '../components/Card';
import { CardData, CardState } from '../types/game';

describe('Card Component', () => {
  const mockCard: CardData = {
    id: 1,
    value: 'A',
    state: 'hidden',
    position: 0,
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders correctly in hidden state', () => {
    render(<Card card={mockCard} onCardClick={mockOnClick} disabled={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('?');
    expect(button).toHaveClass('bg-blue-500');
  });

  it('renders correctly in revealed state', () => {
    const revealedCard = { ...mockCard, state: 'revealed' as CardState };
    render(<Card card={revealedCard} onCardClick={mockOnClick} disabled={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('A');
    expect(button).toHaveClass('bg-white');
  });

  it('renders correctly in matched state', () => {
    const matchedCard = { ...mockCard, state: 'matched' as CardState };
    render(<Card card={matchedCard} onCardClick={mockOnClick} disabled={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('A');
    expect(button).toHaveClass('bg-green-100');
  });

  it('handles click when not disabled', () => {
    render(<Card card={mockCard} onCardClick={mockOnClick} disabled={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith(mockCard);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle click when disabled', () => {
    render(<Card card={mockCard} onCardClick={mockOnClick} disabled={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
