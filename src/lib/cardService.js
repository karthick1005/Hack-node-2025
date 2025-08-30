// Intelligent Card Management Service
import { encryptCardData, decryptCardData, validateCardData, maskCardNumber, maskCardName, secureLocalStorage } from './encryption';

class CardManagementService {
  constructor() {
    this.cards = new Map();
    this.encryptionKey = null;
  }

  // Initialize with encryption key
  initialize(password) {
    this.encryptionKey = password;
    this.loadCards();
  }

  // Add a new card with encryption
  addCard(cardData) {
    if (!this.encryptionKey) {
      throw new Error('Service not initialized with encryption key');
    }

    // Validate card data
    const validation = validateCardData(cardData);
    if (!validation.isValid) {
      throw new Error(`Invalid card data: ${validation.errors.join(', ')}`);
    }

    const cardId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const card = {
      id: cardId,
      ...cardData,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      usageCount: 0,
      isActive: true
    };

    // Encrypt sensitive data
    const sensitiveData = {
      cardNumber: cardData.cardNumber,
      cvv: cardData.cvv,
      expiryDate: cardData.expiryDate
    };

    const encryptedSensitive = encryptCardData(sensitiveData, this.encryptionKey);

    const secureCard = {
      ...card,
      encryptedData: encryptedSensitive,
      // Remove sensitive data from main object
      cardNumber: undefined,
      cvv: undefined,
      expiryDate: undefined
    };

    this.cards.set(cardId, secureCard);
    this.saveCards();

    return {
      id: cardId,
      maskedNumber: maskCardNumber(cardData.cardNumber),
      maskedName: maskCardName(cardData.cardName),
      cardType: cardData.cardType,
      isActive: true
    };
  }

  // Get card with decrypted data
  getCard(cardId) {
    const card = this.cards.get(cardId);
    if (!card) return null;

    try {
      const decryptedData = decryptCardData(card.encryptedData, this.encryptionKey);

      return {
        ...card,
        ...decryptedData,
        // Add masked versions for display
        maskedNumber: maskCardNumber(decryptedData.cardNumber),
        maskedName: maskCardName(card.cardName)
      };
    } catch (error) {
      console.error('Failed to decrypt card data:', error);
      return null;
    }
  }

  // Get all cards (without sensitive data)
  getAllCards() {
    const cards = [];
    for (const [id, card] of this.cards) {
      cards.push({
        id: card.id,
        cardName: card.cardName,
        cardType: card.cardType,
        category: card.category,
        isActive: card.isActive,
        lastUsed: card.lastUsed,
        usageCount: card.usageCount,
        maskedName: maskCardName(card.cardName)
      });
    }
    return cards;
  }

  // Update card usage statistics
  updateCardUsage(cardId, context = {}) {
    const card = this.cards.get(cardId);
    if (card) {
      card.lastUsed = new Date().toISOString();
      card.usageCount += 1;
      card.lastContext = context;
      this.saveCards();
    }
  }

  // Toggle card active status
  toggleCardStatus(cardId) {
    const card = this.cards.get(cardId);
    if (card) {
      card.isActive = !card.isActive;
      this.saveCards();
      return card.isActive;
    }
    return false;
  }

  // Delete card
  deleteCard(cardId) {
    const deleted = this.cards.delete(cardId);
    if (deleted) {
      this.saveCards();
    }
    return deleted;
  }

  // Search cards
  searchCards(query) {
    const allCards = this.getAllCards();
    const lowercaseQuery = query.toLowerCase();

    return allCards.filter(card =>
      card.cardName.toLowerCase().includes(lowercaseQuery) ||
      card.cardType.toLowerCase().includes(lowercaseQuery) ||
      card.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get usage analytics
  getUsageAnalytics() {
    const cards = this.getAllCards();
    const totalUsage = cards.reduce((sum, card) => sum + card.usageCount, 0);
    const activeCards = cards.filter(card => card.isActive).length;

    const categoryUsage = {};
    cards.forEach(card => {
      categoryUsage[card.category] = (categoryUsage[card.category] || 0) + card.usageCount;
    });

    return {
      totalCards: cards.length,
      activeCards,
      totalUsage,
      categoryUsage,
      averageUsage: totalUsage / Math.max(cards.length, 1)
    };
  }

  // Export cards (for backup)
  exportCards() {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      cards: Array.from(this.cards.entries())
    };

    return encryptCardData(exportData, this.encryptionKey);
  }

  // Import cards (from backup)
  importCards(encryptedData) {
    try {
      const importData = decryptCardData(encryptedData, this.encryptionKey);

      if (importData.version && importData.cards) {
        importData.cards.forEach(([id, card]) => {
          this.cards.set(id, card);
        });
        this.saveCards();
        return true;
      }
    } catch (error) {
      console.error('Import failed:', error);
    }
    return false;
  }

  // Private methods
  saveCards() {
    try {
      const cardsArray = Array.from(this.cards.entries());
      secureLocalStorage.setItem('cards', cardsArray, this.encryptionKey);
    } catch (error) {
      console.error('Failed to save cards:', error);
    }
  }

  loadCards() {
    try {
      const cardsArray = secureLocalStorage.getItem('cards', this.encryptionKey);
      if (cardsArray) {
        this.cards = new Map(cardsArray);
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
      this.cards = new Map();
    }
  }

  // Clear all data
  clearAllData() {
    this.cards.clear();
    secureLocalStorage.clear();
  }
}

// Create singleton instance
const cardService = new CardManagementService();

export default cardService;
