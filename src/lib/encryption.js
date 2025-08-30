// Security and Encryption Utilities for PCI-DSS Compliance
import CryptoJS from 'crypto-js';

// Encryption configuration
const ENCRYPTION_CONFIG = {
  keySize: 256,
  iterations: 1000,
  salt: 'IntelligentCardOrganizerSalt2024'
};

// Generate encryption key from password
const generateKey = (password, salt = ENCRYPTION_CONFIG.salt) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: ENCRYPTION_CONFIG.keySize / 32,
    iterations: ENCRYPTION_CONFIG.iterations
  });
};

// Encrypt sensitive card data
export const encryptCardData = (data, password) => {
  try {
    const key = generateKey(password);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key.toString()).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt card data');
  }
};

// Decrypt sensitive card data
export const decryptCardData = (encryptedData, password) => {
  try {
    const key = generateKey(password);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key.toString());
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error('Invalid password or corrupted data');
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt card data');
  }
};

// Hash sensitive data for storage (one-way)
export const hashData = (data) => {
  return CryptoJS.SHA256(data).toString();
};

// Generate secure random token
export const generateSecureToken = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Mask sensitive card information for display
export const maskCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.length < 4) return '****';

  const lastFour = cardNumber.slice(-4);
  const masked = '*'.repeat(cardNumber.length - 4);
  return masked + lastFour;
};

export const maskCardName = (cardName) => {
  if (!cardName) return '';

  const words = cardName.split(' ');
  return words.map(word => {
    if (word.length <= 2) return word;
    return word.charAt(0) + '*'.repeat(word.length - 2) + word.charAt(word.length - 1);
  }).join(' ');
};

// Validate card data format
export const validateCardData = (cardData) => {
  const errors = [];

  // Card number validation (basic Luhn algorithm check)
  if (cardData.cardNumber) {
    const cleanNumber = cardData.cardNumber.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      errors.push('Invalid card number format');
    } else if (!isValidLuhn(cleanNumber)) {
      errors.push('Invalid card number (failed Luhn check)');
    }
  }

  // Expiry date validation
  if (cardData.expiryDate) {
    const [month, year] = cardData.expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) {
      errors.push('Invalid expiry month');
    }

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      errors.push('Card has expired');
    }
  }

  // CVV validation
  if (cardData.cvv) {
    if (!/^\d{3,4}$/.test(cardData.cvv)) {
      errors.push('Invalid CVV format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Luhn algorithm for card number validation
const isValidLuhn = (cardNumber) => {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

// Secure local storage with encryption
export const secureLocalStorage = {
  setItem: (key, value, password) => {
    try {
      const encrypted = encryptCardData(value, password);
      localStorage.setItem(`secure_${key}`, encrypted);
      return true;
    } catch (error) {
      console.error('Secure storage failed:', error);
      return false;
    }
  },

  getItem: (key, password) => {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;

      return decryptCardData(encrypted, password);
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      return null;
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(`secure_${key}`);
  },

  clear: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Generate device fingerprint for additional security
export const generateDeviceFingerprint = () => {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: Date.now()
  };

  return hashData(JSON.stringify(fingerprint));
};

// Security audit logging
export const logSecurityEvent = (eventType, details) => {
  const securityLog = {
    type: eventType,
    details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    fingerprint: generateDeviceFingerprint()
  };

  // Store security logs (in production, this should go to a secure logging service)
  try {
    const existingLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    existingLogs.push(securityLog);

    // Keep only last 100 security logs
    const recentLogs = existingLogs.slice(-100);
    localStorage.setItem('securityLogs', JSON.stringify(recentLogs));
  } catch (error) {
    console.warn('Failed to log security event:', error);
  }

  return securityLog;
};