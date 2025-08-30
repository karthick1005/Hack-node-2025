// Advanced ML-based Card Ranking and Reordering System
import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';

export default function useCardRanking(cards, usageLogs, context, userPreferences = {}) {
  const [rankedCards, setRankedCards] = useState([]);
  const [learningModel, setLearningModel] = useState({
    weights: {
      frequency: 0.3,
      recency: 0.25,
      contextMatch: 0.2,
      userPreference: 0.15,
      timeOfDay: 0.05,
      location: 0.05
    },
    adaptationRate: 0.1
  });

  // Memoize context without time to prevent unnecessary re-renders
  const contextForRanking = useMemo(() => {
    const { time, ...contextWithoutTime } = context || {};
    return contextWithoutTime;
  }, [context?.location, context?.transactionType, context?.deviceType, context?.networkType]);

  // Context-aware scoring algorithm
  const calculateContextScore = (card, currentContext, usageHistory) => {
    let score = 0;

    // Time-based scoring
    if (currentContext?.time) {
      const hour = new Date(currentContext.time).getHours();
      const cardUsageByHour = _.groupBy(
        usageHistory.filter(log => log.cardId === card.id),
        log => new Date(log.timestamp).getHours()
      );

      // Score higher if card is frequently used at similar times
      const similarHourUsage = cardUsageByHour[hour] || [];
      score += (similarHourUsage.length / Math.max(usageHistory.length, 1)) * 0.3;
    }

    // Location-based scoring
    if (currentContext?.location) {
      const locationMatches = usageHistory.filter(
        log => log.cardId === card.id &&
        log.location === currentContext.location
      ).length;
      score += (locationMatches / Math.max(usageHistory.length, 1)) * 0.4;
    }

    // Transaction type matching
    if (currentContext?.transactionType) {
      const typeMatches = usageHistory.filter(
        log => log.cardId === card.id &&
        log.transactionType === currentContext.transactionType
      ).length;
      score += (typeMatches / Math.max(usageHistory.length, 1)) * 0.3;
    }

    return Math.min(score, 1); // Normalize to 0-1
  };

  // Adaptive learning algorithm
  const updateLearningModel = (cardId, wasSelected, context) => {
    setLearningModel(prevModel => {
      const newWeights = { ...prevModel.weights };

      if (wasSelected) {
        // Increase weights for features that were present during selection
        if (context?.time) newWeights.timeOfDay += prevModel.adaptationRate;
        if (context?.location) newWeights.location += prevModel.adaptationRate;
        if (context?.transactionType) newWeights.contextMatch += prevModel.adaptationRate;
      } else {
        // Slightly decrease weights for non-selected features
        Object.keys(newWeights).forEach(key => {
          newWeights[key] = Math.max(0.01, newWeights[key] - prevModel.adaptationRate * 0.1);
        });
      }

      // Normalize weights
      const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
      Object.keys(newWeights).forEach(key => {
        newWeights[key] = newWeights[key] / total;
      });

      return { ...prevModel, weights: newWeights };
    });
  };

  // Main ranking algorithm with ML weights
  const calculateMLScore = (card, usageHistory, currentContext) => {
    const now = Date.now();
    const cardUsage = usageHistory.filter(log => log.cardId === card.id);

    // Frequency score (how often used)
    const frequency = cardUsage.length;
    const frequencyScore = Math.min(frequency / 100, 1); // Normalize

    // Recency score (how recently used)
    const lastUsed = cardUsage.length ?
      Math.max(...cardUsage.map(log => log.timestamp)) : 0;
    const daysSinceLastUse = (now - lastUsed) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - (daysSinceLastUse / 30)); // Decay over 30 days

    // Context matching score
    const contextScore = calculateContextScore(card, currentContext, usageHistory);

    // User preference score
    const preferenceScore = userPreferences[card.id] || 0.5;

    // Time of day preference
    const timeOfDayScore = currentContext?.time ?
      Math.sin((new Date(currentContext.time).getHours() / 24) * 2 * Math.PI) * 0.5 + 0.5 : 0.5;

    // Location consistency score
    const locationScore = currentContext?.location ?
      (cardUsage.filter(log => log.location === currentContext.location).length /
       Math.max(cardUsage.length, 1)) : 0.5;

    // Apply ML weights
    const finalScore =
      frequencyScore * learningModel.weights.frequency +
      recencyScore * learningModel.weights.recency +
      contextScore * learningModel.weights.contextMatch +
      preferenceScore * learningModel.weights.userPreference +
      timeOfDayScore * learningModel.weights.timeOfDay +
      locationScore * learningModel.weights.location;

    return {
      score: finalScore,
      components: {
        frequency: frequencyScore,
        recency: recencyScore,
        context: contextScore,
        preference: preferenceScore,
        timeOfDay: timeOfDayScore,
        location: locationScore
      }
    };
  };

  // Declutter mechanism
  const applyDeclutter = (scoredCards) => {
    const highPriority = scoredCards.filter(card => card.score > 0.7);
    const mediumPriority = scoredCards.filter(card => card.score > 0.3 && card.score <= 0.7);
    const lowPriority = scoredCards.filter(card => card.score <= 0.3);

    return {
      primary: highPriority,
      secondary: mediumPriority,
      hidden: lowPriority
    };
  };

  // Main effect for ranking
  useEffect(() => {
    if (!cards.length) {
      setRankedCards([]);
      return;
    }

    const scored = cards.map(card => {
      const { score, components } = calculateMLScore(card, usageLogs, context);
      return {
        ...card,
        score,
        scoreComponents: components,
        lastCalculated: Date.now()
      };
    });

    // Sort by score (highest first)
    const sorted = scored.sort((a, b) => b.score - a.score);

    // Apply declutter
    const decluttered = applyDeclutter(sorted);

    setRankedCards({
      all: sorted,
      ...decluttered
    });
  }, [cards, usageLogs, contextForRanking, learningModel, userPreferences]);

  // Expose learning function for user feedback
  const learnFromSelection = (cardId, context) => {
    updateLearningModel(cardId, true, context);
  };

  const learnFromRejection = (cardId, context) => {
    updateLearningModel(cardId, false, context);
  };

  return {
    rankedCards,
    learningModel,
    learnFromSelection,
    learnFromRejection,
    // Utility functions
    calculateContextScore,
    applyDeclutter
  };
}
