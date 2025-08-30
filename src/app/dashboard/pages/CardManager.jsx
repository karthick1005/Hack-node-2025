// components/CardManager.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Bell, 
  Search, 
  Filter, 
  Plus,
  MapPin,
  Star,
  Zap,
  Gift,
  RefreshCw
} from 'lucide-react';
import { useRouter } from "next/navigation";
// Import components
import Card from '../components/Card';
import MyCards from '../components/myCards';
import SingleCardDetails from '../components/singleCardDetails';
import SmartSuggestions from '../components/SmartSuggestions';
import Button from '../components/Button';
import useAuthStore from '../../../store/authStore';
import api from '../../../lib/axios';
import { CardSkeleton } from '../../../components/LoadingSpinner';

const CardManager = ({ onMobileSidebarOpen }) => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Cards');
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch user's cards from Firestore
  const fetchUserCards = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/card-details?user_id=${user.uid}`);
      setUserCards(response.data);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCards();
  }, [user?.uid]);

  // Transform Firestore data to component format
  const transformCardData = (card) => {
    console.log('Raw card data from Firestore:', card); // Debug log
    console.log('Card usage count:', card.card_usage_count); // Debug usage count
    
    const cardType = card.card_type?.toLowerCase();
    
    // Determine icon and colors based on card type
    let icon = CreditCard;
    let bgColor = 'bg-blue-600';
    let iconColor = 'text-blue-600';
    let iconBg = 'bg-blue-50';

    switch (cardType) {
      case 'credit':
        icon = CreditCard;
        bgColor = 'bg-blue-600';
        iconColor = 'text-blue-600';
        iconBg = 'bg-blue-50';
        break;
      case 'debit':
        icon = CreditCard;
        bgColor = 'bg-green-600';
        iconColor = 'text-green-600';
        iconBg = 'bg-green-50';
        break;
      case 'loyalty':
        icon = Star;
        bgColor = 'bg-purple-600';
        iconColor = 'text-purple-600';
        iconBg = 'bg-purple-50';
        break;
      case 'gift':
        icon = Gift;
        bgColor = 'bg-yellow-600';
        iconColor = 'text-yellow-600';
        iconBg = 'bg-yellow-50';
        break;
      default:
        icon = CreditCard;
        bgColor = 'bg-gray-600';
        iconColor = 'text-gray-600';
        iconBg = 'bg-gray-50';
    }

    return {
      id: card.card_id,
      icon,
      bgColor,
      iconColor,
      iconBg,
      textColor: 'text-white',
      
      // Card details
      type: card.card_type,
      name: card.card_name,
      number: card.card_number?.slice(-4) || 'N/A',
      fullNumber: card.card_number,
      balance: card.balance?.toLocaleString() || '0',
      status: card.card_status ? 'Active' : 'Inactive',
      description: card.card_description,
      
      // Usage info
      usageCount: card.card_usage_count ?? 0, // Use nullish coalescing for better handling
      lastUsed: card.lastUsageTime ? new Date(card.lastUsageTime.seconds * 1000).toLocaleDateString() : 'Never',
      expires: card.expiryDate ? new Date(card.expiryDate.seconds * 1000).toLocaleDateString() : 'N/A',
      
      // Location and settings
      locations: card.location || [],
      locationTrack: card.location_track,
      transactionAlert: card.transaction_alert,
      pin: card.pin,
      
      // User info
      userName: card.userName,
      user_id: card.user_id,
      created_at: card.created_at
    };
  };

  // Filter cards based on search and filter type
  const filteredCards = userCards
    .map(transformCardData)
    .filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'All Cards' || 
                           (filterType === 'Payment' && ['credit', 'debit'].includes(card.type.toLowerCase())) ||
                           (filterType === 'Loyalty' && card.type.toLowerCase() === 'loyalty') ||
                           (filterType === 'Gift Cards' && card.type.toLowerCase() === 'gift') ||
                           (filterType === 'Crypto' && card.type.toLowerCase() === 'crypto') ||
                           (filterType === 'Travel' && card.type.toLowerCase() === 'travel');
      
      return matchesSearch && matchesFilter;
    });

  // Generate smart suggestions based on user's cards
  const generateSmartSuggestions = () => {
    const suggestions = [];
    const usedCardIds = new Set(); // Track cards already added to suggestions

    // Only show usage-based suggestions if we have cards with actual usage
    const cardsWithUsage = filteredCards.filter(card => card.usageCount > 0);

    if (cardsWithUsage.length > 0) {
      // Most used card (only if there are cards with usage)
      const mostUsedCard = cardsWithUsage.reduce((prev, current) =>
        (prev.usageCount > current.usageCount) ? prev : current);

      if (mostUsedCard && !usedCardIds.has(mostUsedCard.id)) {
        suggestions.push({
          id: mostUsedCard.id,
          icon: mostUsedCard.icon,
          title: mostUsedCard.name,
          subtitle: `${mostUsedCard.type} •••• ${mostUsedCard.number}`,
          badge: 'Most Used',
          badgeVariant: 'purple',
          actionText: `Used ${mostUsedCard.usageCount} times`,
          iconBg: mostUsedCard.iconBg,
          iconColor: mostUsedCard.iconColor
        });
        usedCardIds.add(mostUsedCard.id);
      }

      // Recently used card (only from cards with usage)
      const recentCard = cardsWithUsage
        .filter(card => !usedCardIds.has(card.id))
        .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))[0];

      if (recentCard && recentCard.lastUsed !== 'Never' && !usedCardIds.has(recentCard.id)) {
        suggestions.push({
          id: recentCard.id,
          icon: recentCard.icon,
          title: recentCard.name,
          subtitle: `${recentCard.type} •••• ${recentCard.number}`,
          badge: 'Recent',
          badgeVariant: 'info',
          actionText: `Last used: ${recentCard.lastUsed}`,
          iconBg: recentCard.iconBg,
          iconColor: recentCard.iconColor
        });
        usedCardIds.add(recentCard.id);
      }
    }

    // Location-based suggestion (for all cards)
    const locationCard = filteredCards.find(card =>
      card.locationTrack &&
      card.locations.length > 0 &&
      !usedCardIds.has(card.id)
    );

    if (locationCard && !usedCardIds.has(locationCard.id)) {
      suggestions.push({
        id: locationCard.id,
        icon: MapPin,
        title: locationCard.name,
        subtitle: 'Location Tracking Enabled',
        badge: 'Nearby',
        badgeVariant: 'success',
        actionText: `Available in ${locationCard.locations[0]}`,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600'
      });
      usedCardIds.add(locationCard.id);
    }

    // If we still have space, add other useful suggestions
    if (suggestions.length < 3) {
      const remainingCards = filteredCards.filter(card => !usedCardIds.has(card.id));

      // Add high balance cards
      const highBalanceCards = remainingCards
        .filter(card => parseFloat(card.balance.replace(/,/g, '')) > 1000)
        .sort((a, b) => parseFloat(b.balance.replace(/,/g, '')) - parseFloat(a.balance.replace(/,/g, '')));

      for (const card of highBalanceCards) {
        if (suggestions.length >= 3) break;

        suggestions.push({
          id: card.id,
          icon: card.icon,
          title: card.name,
          subtitle: `${card.type} •••• ${card.number}`,
          badge: 'High Balance',
          badgeVariant: 'success',
          actionText: `Balance: ₹${card.balance}`,
          iconBg: card.iconBg,
          iconColor: card.iconColor
        });
        usedCardIds.add(card.id);
      }

      // Add active cards if still space
      if (suggestions.length < 3) {
        const activeCards = remainingCards.filter(card => card.status === 'Active');

        for (const card of activeCards) {
          if (suggestions.length >= 3) break;

          suggestions.push({
            id: card.id,
            icon: card.icon,
            title: card.name,
            subtitle: `${card.type} •••• ${card.number}`,
            badge: 'Active',
            badgeVariant: 'info',
            actionText: 'Ready to use',
            iconBg: card.iconBg,
            iconColor: card.iconColor
          });
          usedCardIds.add(card.id);
        }
      }
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions max
  };

  const smartSuggestions = generateSmartSuggestions();

  // Remove old static data and replace with dynamic data
  const handleCardClick = (cardData) => {
    console.log("Card clicked:", cardData);
    router.push(`/dashboard/${cardData.id}`);
  };

  const handleMenuClick = (cardData) => {
    console.log('Menu clicked:', cardData);
  };

  const handleDetailsClick = (cardData) => {
    console.log('Details clicked :', cardData);
    router.push(`/dashboard/${cardData.id}`);
  };

  const handleAddCard = () => {
    router.push('/dashboard/add-card');
  };

  // ✅ Add payment handler that passes card ID
  const handlePaymentClick = (cardData) => {
    console.log('Payment clicked for card:', cardData);
    router.push(`/transaction?card_id=${cardData.id}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMobileSidebarOpen}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">My Cards</h1>
            {loading && (
              <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={fetchUserCards}
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            {/* ✅ User Profile with Hover Tooltip */}
            <div className="relative group">
              <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer transition-transform hover:scale-105">
                {user?.photoURL ? (
                  <img
                    src={user?.photoURL}
                    alt="User profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.displayName?.[0] || '?'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* ✅ Hover Tooltip */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    {user?.photoURL ? (
                      <img
                        src={user?.photoURL}
                        alt="User profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-blue-600 flex items-center justify-center">
                        <span className="text-lg font-medium text-white">
                          {user?.displayName?.[0] || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {user?.displayName || 'User'}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user?.email || 'No email available'}
                    </div>
                    {user?.uid && (
                      <div className="text-xs text-gray-400 truncate mt-1">
                        ID: {user.uid.slice(0, 8)}...{user.uid.slice(-4)}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* ✅ Additional User Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Cards:</span>
                      <span className="font-medium">{userCards.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
                
                {/* ✅ Small Arrow Pointer */}
                <div className="absolute top-0 right-4 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Banner */}
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <MapPin className="h-4 w-4" />
          <span>Location services are enabled for smart card suggestions</span>
          {/* <Button variant="ghost" size="sm" className="ml-auto text-blue-600">
            Manage
          </Button> */}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-1 text-red-600"
              onClick={fetchUserCards}
            >
              Retry
            </Button>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 p-4 lg:p-6">
        {/* Smart Suggestions */}
        {smartSuggestions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Smart Suggestions</h2>
              {/* <Button variant="ghost" size="sm">
                Customize
              </Button> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {smartSuggestions.map((suggestion, index) => (
                <SmartSuggestions 
                  key={suggestion.id || index} 
                  {...suggestion} 
                  onAction={() => handleCardClick(suggestion)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Cards Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">All Cards</h2>
              <span className="text-sm text-gray-500">
                ({filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''})
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cards"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filter
              </Button> */}
              
              <Button variant="primary" size="sm" onClick={handleAddCard}>
                <Plus className="h-4 w-4" />
                Add Card
              </Button>
            </div>
          </div>

          {/* Card Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['All Cards', 'Payment', 'Loyalty', 'Travel', 'Crypto', 'Gift Cards'].map(category => (
              <Button
                key={category}
                variant={filterType === category ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilterType(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* No Cards State */}
          {!loading && !error && filteredCards.length === 0 && userCards.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
              <p className="text-gray-600 mb-4">Add your first card to get started</p>
              <Button variant="primary" onClick={handleAddCard}>
                <Plus className="h-4 w-4" />
                Add Your First Card
              </Button>
            </div>
          )}

          {/* No Filtered Results */}
          {!loading && !error && filteredCards.length === 0 && userCards.length > 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter</p>
              <Button variant="ghost" onClick={() => { setSearchTerm(''); setFilterType('All Cards'); }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Cards Grid */}
          {!loading && !error && filteredCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* User's Real Cards */}
              {filteredCards.map((card) => {
                // const isPaymentCard = ['credit', 'debit'].includes(card.type.toLowerCase());
                
                // if (isPaymentCard) {
                  return (
                    <MyCards 
                      key={card.id} 
                      type={card.type}
                      name={card.name}
                      number={card.number}
                      balance={card.balance}
                      expires={card.expires}
                      icon={card.icon}
                      bgColor={card.bgColor}
                      textColor={card.textColor}
                      status={card.status}
                      onDetailsClick={() => handleDetailsClick(card)}
                      onMenuClick={() => handleMenuClick(card)}
                    />
                  );
                // } else {
                //   return (
                //     <SingleCardDetails 
                //       key={card.id} 
                //       name={card.name}
                //       type={card.type}
                //       balance={card.balance}
                //       status={card.status}
                //       lastUsed={card.lastUsed}
                //       icon={card.icon}
                //       bgColor={card.iconBg}
                //       iconColor={card.iconColor}
                //       usageCount={card.usageCount}
                //       locations={card.locations}
                //       onDetailsClick={() => handleDetailsClick(card)}
                //       onMenuClick={() => handleMenuClick(card)}
                //     />
                //   );
                // }
              })}

              {/* Add New Card */}
              <Card 
                className="p-6 border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[170px]"
                onClick={handleAddCard}
              >
                <Plus className="h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Add New Card</h3>
                <p className="text-sm text-gray-600 text-center">Connect a payment or loyalty card</p>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CardManager;