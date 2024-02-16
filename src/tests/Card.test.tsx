import { render, screen } from '@testing-library/react';
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
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('?');
    expect(button).toHaveClass('bg-blue-500');
  });
});
