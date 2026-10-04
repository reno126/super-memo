import { CardData } from '../../types/game';

export const testCards: CardData[] = [
  { id: 1, value: 'A', state: 'hidden', position: 0 },
  { id: 2, value: 'A', state: 'hidden', position: 1 },
  { id: 3, value: 'B', state: 'hidden', position: 2 },
  { id: 4, value: 'B', state: 'hidden', position: 3 },
  { id: 5, value: 'C', state: 'hidden', position: 4 },
  { id: 6, value: 'C', state: 'hidden', position: 5 },
];

export const revealedCards: CardData[] = [
  { id: 1, value: 'A', state: 'revealed', position: 0 },
  { id: 2, value: 'A', state: 'matched', position: 1 },
];

export function findMatchingCardPair(cardCollection: CardData[]): [CardData, CardData] {
  const firstCard = cardCollection.find((card, cardIndex) =>
    cardCollection.some(
      (candidateCard, candidateIndex) =>
        candidateIndex !== cardIndex && candidateCard.value === card.value
    )
  );

  if (!firstCard) {
    throw new Error('Expected at least one matching card pair.');
  }

  const secondCard = cardCollection.find(
    candidateCard => candidateCard.id !== firstCard.id && candidateCard.value === firstCard.value
  );

  if (!secondCard) {
    throw new Error('Expected a second card with the matching symbol.');
  }

  return [firstCard, secondCard];
}

export function findNonMatchingCardPair(cardCollection: CardData[]): [CardData, CardData] {
  const firstCard = cardCollection.find(card =>
    cardCollection.some(candidateCard => candidateCard.value !== card.value)
  );

  if (!firstCard) {
    throw new Error('Expected at least two cards with different symbols.');
  }

  const secondCard = cardCollection.find(candidateCard => candidateCard.value !== firstCard.value);

  if (!secondCard) {
    throw new Error('Expected a second card with a different symbol.');
  }

  return [firstCard, secondCard];
}
