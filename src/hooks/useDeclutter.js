// Hook for decluttering rarely used cards
import { useMemo } from 'react';

export default function useDeclutter(rankedCards, threshold = 2) {
  // Cards with score below threshold are decluttered
  return useMemo(() => {
    const main = rankedCards.filter(card => card.score >= threshold);
    const decluttered = rankedCards.filter(card => card.score < threshold);
    return { main, decluttered };
  }, [rankedCards, threshold]);
}
