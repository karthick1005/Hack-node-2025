// Lightweight ML model stub for adaptive learning
export function refineSuggestions(cards, feedback) {
  // Simple adaptive logic: increase score for positive feedback
  return cards.map(card => {
    const fb = feedback.find(f => f.cardId === card.id);
    if (fb && fb.positive) {
      return { ...card, score: card.score + 1 };
    }
    return card;
  });
}
