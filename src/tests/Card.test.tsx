import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../setupTests';
import { Card } from '../components/Card';
import { CardData } from '../types/game';

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
    const cardButton = screen.getByRole('button', { name: /karta 1, odwrócona/i });
    expect(cardButton).toHaveTextContent('?');
  });

  it('renders correctly in revealed state', () => {
    const revealedCard: CardData = { ...mockCard, state: 'revealed' };
    render(<Card card={revealedCard} onCardClick={mockOnClick} disabled={false} />);
    const cardButton = screen.getByRole('button', { name: /karta 1, odkryta, symbol a/i });
    expect(cardButton).toHaveTextContent('A');
  });

  it('renders correctly in matched state', () => {
    const matchedCard: CardData = { ...mockCard, state: 'matched' };
    render(<Card card={matchedCard} onCardClick={mockOnClick} disabled={false} />);
    const cardButton = screen.getByRole('button', { name: /karta 1, dopasowana, symbol a/i });
    expect(cardButton).toHaveTextContent('A');
  });

  it('handles click when not disabled', async () => {
    const user = userEvent.setup();
    render(<Card card={mockCard} onCardClick={mockOnClick} disabled={false} />);
    await user.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith(mockCard);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle click when disabled', async () => {
    const user = userEvent.setup();
    render(<Card card={mockCard} onCardClick={mockOnClick} disabled={true} />);
    await user.click(screen.getByRole('button'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
