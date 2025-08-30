"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/authStore";
import Navbar from './components/navbar';
import CardManager from './pages/CardManager';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Button from './components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

// Import our intelligent card system hooks
import useCardRanking from '../../hooks/useCardRanking';
import { useContextCapture } from '../../hooks/useContextCapture';
import { useAdaptiveLearning } from '../../hooks/useAdaptiveLearning';
import cardService from '../../lib/cardService';

const Page = () => {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('cards');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cardChangeCounter, setCardChangeCounter] = useState(0);

  // Initialize our intelligent card system
  const {
    currentContext,
    usageLogs,
    logCardUsage,
    getUsagePatterns,
    setTransactionContext,
    refreshLocation
  } = useContextCapture();

  const {
    userPreferences,
    personalizationModel,
    learnFromBehavior,
    getPersonalizedScore,
    pinCard,
    unpinCard,
    tagCard
  } = useAdaptiveLearning();

  // Memoize cards to prevent infinite re-renders
  const cards = useMemo(() => {
    return cardService.getAllCards();
  }, [isInitialized, cardChangeCounter]);

  // Get ranked cards with ML-based scoring
  const {
    rankedCards,
    learnFromSelection,
    learnFromRejection
  } = useCardRanking(
    cards,
    usageLogs,
    currentContext,
    userPreferences
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  // Initialize card service with encryption
  useEffect(() => {
    if (user && !isInitialized) {
      // Use user's ID as encryption key (in production, use proper password/key management)
      const encryptionKey = user.uid || 'defaultKey';
      cardService.initialize(encryptionKey);
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  // Handle card selection with learning
  const handleCardSelection = (cardId, context = {}) => {
    logCardUsage(cardId, 'selected', context);
    learnFromBehavior(cardId, 'selected', { ...currentContext, ...context });
    learnFromSelection(cardId, { ...currentContext, ...context });
    cardService.updateCardUsage(cardId, { ...currentContext, ...context });
    setCardChangeCounter(prev => prev + 1); // Trigger re-memoization
  };

  // Handle card rejection with learning
  const handleCardRejection = (cardId, context = {}) => {
    logCardUsage(cardId, 'rejected', context);
    learnFromBehavior(cardId, 'rejected', { ...currentContext, ...context });
    learnFromRejection(cardId, { ...currentContext, ...context });
  };

  const renderContent = () => {
    const commonProps = {
      rankedCards,
      currentContext,
      usageLogs,
      userPreferences,
      personalizationModel,
      onCardSelect: handleCardSelection,
      onCardReject: handleCardRejection,
      onPinCard: pinCard,
      onUnpinCard: unpinCard,
      onTagCard: tagCard,
      onMobileSidebarOpen: () => setIsMobileSidebarOpen(true)
    };

    switch (activeTab) {
      case 'cards':
        return <CardManager {...commonProps} />;
      case 'transactions':
        return (
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 lg:p-6 lg:hidden">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              <Transactions {...commonProps} />
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Analytics</h1>
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              <Analytics
                {...commonProps}
                usagePatterns={getUsagePatterns()}
                analytics={cardService.getUsageAnalytics()}
              />
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Notifications</h1>
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              <Notifications
                {...commonProps}
                onMobileSidebarOpen={() => setIsMobileSidebarOpen(true)}
              />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Settings</h1>
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              <Settings
                {...commonProps}
                onRefreshLocation={refreshLocation}
                onResetLearning={() => {
                  // Reset learning functionality would go here
                  console.log('Reset learning clicked');
                }}
              />
            </div>
          </div>
        );
      default:
        return <CardManager {...commonProps} />;
    }
  };

  if (loading) return (
    <LoadingSpinner
      type="default"
      message="Loading Intelligent Card Organizer"
      subtitle="Initializing AI-powered card management system..."
      fullScreen={true}
    />
  );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Sidebar */}
      <div className="lg:hidden z-50">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-30">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isMobile={false}
          isOpen={true}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10">
        {renderContent()}
      </div>

      {/* Context Indicator */}
      {/* <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-50">
        <div className="text-xs text-gray-500 mb-1">Current Context</div>
        <div className="text-sm font-medium">
          {currentContext?.location?.name || 'Unknown Location'}
        </div>
        <div className="text-xs text-gray-400">
          {new Date(currentContext?.time || Date.now()).toLocaleTimeString()}
        </div>
      </div> */}
    </div>
  );
};

export default Page;
