// Context-Aware Data Capture System
import { useState, useEffect, useCallback } from 'react';

export function useContextCapture() {
  const [currentContext, setCurrentContext] = useState({
    location: null,
    time: new Date().toISOString(),
    transactionType: null,
    deviceType: null,
    networkType: null
  });

  const [usageLogs, setUsageLogs] = useState([]);

  // Get user's location (with permission)
  const captureLocation = useCallback(async () => {
    try {
      if ('geolocation' in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 300000 // 5 minutes
          });
        });

        const { latitude, longitude } = position.coords;

        // Get location name using reverse geocoding (simplified)
        const locationName = await getLocationName(latitude, longitude);

        setCurrentContext(prev => ({
          ...prev,
          location: {
            latitude,
            longitude,
            name: locationName,
            accuracy: position.coords.accuracy
          }
        }));
      }
    } catch (error) {
      console.warn('Location capture failed:', error);
      // Fallback to IP-based location or default
      setCurrentContext(prev => ({
        ...prev,
        location: { name: 'Unknown Location' }
      }));
    }
  }, []);

  // Simplified reverse geocoding
  const getLocationName = async (lat, lng) => {
    try {
      // In a real app, you'd use a geocoding service
      // For now, return a mock location based on coordinates
      return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    } catch (error) {
      return 'Unknown Location';
    }
  };

  // Detect device type
  const detectDeviceType = useCallback(() => {
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      deviceType = /iPad|iPhone|iPod/.test(userAgent) ? 'ios' : 'android';
    }

    setCurrentContext(prev => ({ ...prev, deviceType }));
  }, []);

  // Detect network type
  const detectNetworkType = useCallback(async () => {
    try {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setCurrentContext(prev => ({
          ...prev,
          networkType: connection.effectiveType || 'unknown'
        }));
      }
    } catch (error) {
      console.warn('Network detection failed:', error);
    }
  }, []);

  // Update time context periodically
  useEffect(() => {
    const updateTime = () => {
      setCurrentContext(prev => ({
        ...prev,
        time: new Date().toISOString()
      }));
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Initialize context capture
  useEffect(() => {
    detectDeviceType();
    detectNetworkType();
    captureLocation();
  }, [detectDeviceType, detectNetworkType, captureLocation]);

  // Log card usage with context
  const logCardUsage = useCallback((cardId, action, additionalContext = {}) => {
    const usageLog = {
      id: Date.now() + Math.random(),
      cardId,
      action, // 'selected', 'viewed', 'transaction'
      timestamp: Date.now(),
      context: {
        ...currentContext,
        ...additionalContext
      }
    };

    setUsageLogs(prev => {
      const updated = [usageLog, ...prev];
      // Keep only last 1000 logs to prevent memory issues
      return updated.slice(0, 1000);
    });

    // Store in localStorage for persistence
    try {
      const existingLogs = JSON.parse(localStorage.getItem('cardUsageLogs') || '[]');
      const updatedLogs = [usageLog, ...existingLogs].slice(0, 1000);
      localStorage.setItem('cardUsageLogs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.warn('Failed to persist usage logs:', error);
    }

    return usageLog;
  }, [currentContext]);

  // Load persisted logs on mount
  useEffect(() => {
    try {
      const persistedLogs = JSON.parse(localStorage.getItem('cardUsageLogs') || '[]');
      setUsageLogs(persistedLogs);
    } catch (error) {
      console.warn('Failed to load persisted usage logs:', error);
    }
  }, []);

  // Get usage patterns for analytics
  const getUsagePatterns = useCallback((cardId = null) => {
    const relevantLogs = cardId
      ? usageLogs.filter(log => log.cardId === cardId)
      : usageLogs;

    const patterns = {
      byHour: {},
      byLocation: {},
      byDevice: {},
      byAction: {},
      totalUsage: relevantLogs.length
    };

    relevantLogs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      const location = log.context?.location?.name || 'Unknown';
      const device = log.context?.deviceType || 'Unknown';

      patterns.byHour[hour] = (patterns.byHour[hour] || 0) + 1;
      patterns.byLocation[location] = (patterns.byLocation[location] || 0) + 1;
      patterns.byDevice[device] = (patterns.byDevice[device] || 0) + 1;
      patterns.byAction[log.action] = (patterns.byAction[log.action] || 0) + 1;
    });

    return patterns;
  }, [usageLogs]);

  // Set transaction context
  const setTransactionContext = useCallback((transactionType) => {
    setCurrentContext(prev => ({
      ...prev,
      transactionType
    }));
  }, []);

  return {
    currentContext,
    usageLogs,
    logCardUsage,
    getUsagePatterns,
    setTransactionContext,
    refreshLocation: captureLocation
  };
}
