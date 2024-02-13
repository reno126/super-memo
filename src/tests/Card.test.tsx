import { render, screen } from '@testing-library/react';
import '../setupTests';
import { Card } from '../components/Card';
import { CardData } from '../types/game';

describe('App init test sample', () => {
  const mockCard: CardData = {
    id: 1,
    value: 'A',
    state: 'revealed',
    position: 0,
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders correctly App component', () => {
    render(<Card card={mockCard} disabled={false} onCardClick={mockOnClick} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('A');
    expect(button).toHaveClass('bg-white');
  });
});
