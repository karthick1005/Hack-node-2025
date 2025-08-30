// Adaptive Learning and Personalization System
import { useState, useEffect, useCallback } from 'react';

export function useAdaptiveLearning() {
  const [userPreferences, setUserPreferences] = useState({});
  const [learningHistory, setLearningHistory] = useState([]);
  const [personalizationModel, setPersonalizationModel] = useState({
    cardPreferences: {},
    contextPatterns: {},
    timePatterns: {},
    locationPatterns: {},
    confidence: 0.5
  });

  // Load persisted preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        setUserPreferences(JSON.parse(saved));
      }

      const savedModel = localStorage.getItem('personalizationModel');
      if (savedModel) {
        setPersonalizationModel(JSON.parse(savedModel));
      }

      const savedHistory = localStorage.getItem('learningHistory');
      if (savedHistory) {
        setLearningHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.warn('Failed to load personalization data:', error);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((preferences) => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }, []);

  const saveModel = useCallback((model) => {
    try {
      localStorage.setItem('personalizationModel', JSON.stringify(model));
    } catch (error) {
      console.warn('Failed to save personalization model:', error);
    }
  }, []);

  const saveHistory = useCallback((history) => {
    try {
      const recentHistory = history.slice(-500); // Keep last 500 entries
      localStorage.setItem('learningHistory', JSON.stringify(recentHistory));
    } catch (error) {
      console.warn('Failed to save learning history:', error);
    }
  }, []);

  // Manual preference setting
  const setCardPreference = useCallback((cardId, preference) => {
    const updated = {
      ...userPreferences,
      [cardId]: {
        ...userPreferences[cardId],
        ...preference,
        lastUpdated: Date.now()
      }
    };

    setUserPreferences(updated);
    savePreferences(updated);

    // Log the preference change
    const historyEntry = {
      type: 'preference_change',
      cardId,
      preference,
      timestamp: Date.now()
    };

    const updatedHistory = [...learningHistory, historyEntry];
    setLearningHistory(updatedHistory);
    saveHistory(updatedHistory);
  }, [userPreferences, learningHistory, savePreferences, saveHistory]);

  // Pin/unpin cards
  const pinCard = useCallback((cardId) => {
    setCardPreference(cardId, { pinned: true, priority: 1.0 });
  }, [setCardPreference]);

  const unpinCard = useCallback((cardId) => {
    setCardPreference(cardId, { pinned: false });
  }, [setCardPreference]);

  // Tag cards for categorization
  const tagCard = useCallback((cardId, tags) => {
    const currentTags = userPreferences[cardId]?.tags || [];
    const newTags = Array.isArray(tags) ? tags : [tags];
    const updatedTags = [...new Set([...currentTags, ...newTags])];

    setCardPreference(cardId, { tags: updatedTags });
  }, [userPreferences, setCardPreference]);

  const removeTag = useCallback((cardId, tag) => {
    const currentTags = userPreferences[cardId]?.tags || [];
    const updatedTags = currentTags.filter(t => t !== tag);

    setCardPreference(cardId, { tags: updatedTags });
  }, [userPreferences, setCardPreference]);

  // Learn from user behavior
  const learnFromBehavior = useCallback((cardId, action, context) => {
    const behaviorEntry = {
      type: 'behavior',
      cardId,
      action, // 'selected', 'rejected', 'pinned', etc.
      context,
      timestamp: Date.now()
    };

    const updatedHistory = [...learningHistory, behaviorEntry];
    setLearningHistory(updatedHistory);
    saveHistory(updatedHistory);

    // Update personalization model
    setPersonalizationModel(prev => {
      const updated = { ...prev };

      // Update card preferences based on behavior
      if (!updated.cardPreferences[cardId]) {
        updated.cardPreferences[cardId] = { score: 0.5, interactions: 0 };
      }

      const cardPref = updated.cardPreferences[cardId];
      cardPref.interactions++;

      // Adjust score based on action
      switch (action) {
        case 'selected':
          cardPref.score = Math.min(1.0, cardPref.score + 0.1);
          break;
        case 'rejected':
          cardPref.score = Math.max(0.0, cardPref.score - 0.05);
          break;
        case 'pinned':
          cardPref.score = 1.0;
          break;
      }

      // Update context patterns
      if (context?.location) {
        const locationKey = context.location.name || context.location;
        if (!updated.locationPatterns[locationKey]) {
          updated.locationPatterns[locationKey] = {};
        }
        updated.locationPatterns[locationKey][cardId] =
          (updated.locationPatterns[locationKey][cardId] || 0) + 1;
      }

      // Update time patterns
      if (context?.time) {
        const hour = new Date(context.time).getHours();
        if (!updated.timePatterns[hour]) {
          updated.timePatterns[hour] = {};
        }
        updated.timePatterns[hour][cardId] =
          (updated.timePatterns[hour][cardId] || 0) + 1;
      }

      // Increase confidence as we learn more
      updated.confidence = Math.min(0.9, updated.confidence + 0.01);

      saveModel(updated);
      return updated;
    });
  }, [learningHistory, saveHistory, saveModel]);

  // Get personalized recommendations
  const getPersonalizedScore = useCallback((cardId, context) => {
    const baseScore = personalizationModel.cardPreferences[cardId]?.score || 0.5;
    let contextBonus = 0;

    // Location bonus
    if (context?.location) {
      const locationKey = context.location.name || context.location;
      const locationUsage = personalizationModel.locationPatterns[locationKey]?.[cardId] || 0;
      contextBonus += Math.min(0.2, locationUsage * 0.05);
    }

    // Time bonus
    if (context?.time) {
      const hour = new Date(context.time).getHours();
      const timeUsage = personalizationModel.timePatterns[hour]?.[cardId] || 0;
      contextBonus += Math.min(0.2, timeUsage * 0.05);
    }

    // User preference bonus
    const userPref = userPreferences[cardId];
    let preferenceBonus = 0;
    if (userPref?.pinned) preferenceBonus += 0.3;
    if (userPref?.priority) preferenceBonus += userPref.priority * 0.2;

    return Math.min(1.0, baseScore + contextBonus + preferenceBonus);
  }, [personalizationModel, userPreferences]);

  // Reset learning (for testing or user preference)
  const resetLearning = useCallback(() => {
    setUserPreferences({});
    setLearningHistory([]);
    setPersonalizationModel({
      cardPreferences: {},
      contextPatterns: {},
      timePatterns: {},
      locationPatterns: {},
      confidence: 0.5
    });

    localStorage.removeItem('userPreferences');
    localStorage.removeItem('personalizationModel');
    localStorage.removeItem('learningHistory');
  }, []);

  // Export learning data for analysis
  const exportLearningData = useCallback(() => {
    return {
      userPreferences,
      personalizationModel,
      learningHistory,
      exportDate: new Date().toISOString()
    };
  }, [userPreferences, personalizationModel, learningHistory]);

  return {
    userPreferences,
    personalizationModel,
    learningHistory,

    // Manual controls
    setCardPreference,
    pinCard,
    unpinCard,
    tagCard,
    removeTag,

    // Learning functions
    learnFromBehavior,
    getPersonalizedScore,

    // Utility functions
    resetLearning,
    exportLearningData
  };
}
