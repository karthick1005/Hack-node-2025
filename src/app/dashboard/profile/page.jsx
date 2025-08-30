'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/authStore';
import { useRouter } from 'next/navigation';
import axios from '../../../lib/axios';
import { User, CreditCard, Activity, Mail, Calendar, ArrowLeft } from 'lucide-react';
import LoadingSpinner, { CardSkeleton, TransactionSkeleton } from '../../../components/LoadingSpinner';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [userCards, setUserCards] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const [loadingCardId, setLoadingCardId] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch user's cards and transactions
  useEffect(() => {
    const fetchUserData = async () => {
      console.log('User object:', user);
      console.log('User UID:', user?.uid);
      console.log('Is authenticated:', isAuthenticated);
      
      if (!user?.uid) {
        console.log('No user UID found, setting loading to false');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching cards for user:', user.uid);
        
        // Fetch user's cards using API
        const cardsResponse = await axios.get(`/card-details?user_id=${user.uid}`);
        console.log('Cards response:', cardsResponse.data);
        setUserCards(cardsResponse.data || []);

        // Fetch user's transactions using API
        const transactionsResponse = await axios.get(`/transactions?user_id=${user.uid}`);
        console.log('Transactions response:', transactionsResponse.data);
        setUserTransactions(transactionsResponse.data || []);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    // Handle Firebase Timestamp
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString();
    }
    
    // Handle Firestore timestamp object
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    
    // Handle regular date
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const handleNavigation = async (path) => {
    setNavigationLoading(true);
    try {
      await router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => {
        setNavigationLoading(false);
      }, 500);
    }
  };

  const handleCardNavigation = async (cardId) => {
    setLoadingCardId(cardId);
    try {
      await router.push(`/dashboard/${cardId}`);
    } catch (error) {
      console.error('Card navigation error:', error);
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => {
        setLoadingCardId(null);
      }, 500);
    }
  };

  if (authLoading) {
    return (
      <LoadingSpinner 
        type="profile" 
        message="Checking Authentication" 
        subtitle="Please wait while we verify your credentials..."
        fullScreen={true}
      />
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <LoadingSpinner 
        type="profile" 
        message="Loading Profile" 
        subtitle="Fetching your profile information..."
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => handleNavigation('/dashboard')}
            disabled={navigationLoading}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 cursor-pointer transition-colors duration-200 hover:bg-gray-100 px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {navigationLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <ArrowLeft className="h-5 w-5" />
            )}
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full overflow-hidden shadow-md">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user?.displayName || 'User'}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow duration-200">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="font-semibold text-gray-900">{user?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow duration-200">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Member Since</p>
                <p className="font-semibold text-gray-900">{formatDate(user?.metadata?.creationTime)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">My Cards</h3>
            <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full font-medium shadow-sm">
              {userCards.length}
            </span>
          </div>

          {userCards.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No cards found</p>
              <button
                onClick={() => handleNavigation('/dashboard')}
                disabled={navigationLoading}
                className="mt-2 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200 hover:bg-blue-50 px-3 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {navigationLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : null}
                Add your first card
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCards.map((card) => (
                <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{card.card_name || 'Card'}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      card.card_type === 'credit' 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                    }`}>
                      {card.card_type || 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-mono">
                    **** **** **** {card.card_number?.slice(-4)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">
                      Balance: {formatCurrency(card.balance)}
                    </span>
                    <button
                      onClick={() => handleCardNavigation(card.id)}
                      disabled={loadingCardId === card.id}
                      className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer transition-colors duration-200 hover:bg-blue-50 px-2 py-1 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loadingCardId === card.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      ) : null}
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
            <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm px-3 py-1 rounded-full font-medium shadow-sm">
              {userTransactions.length}
            </span>
          </div>

          {userTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userTransactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full shadow-sm ${
                      transaction.status ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {transaction.transaction_name || 'Transaction'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.status ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.status ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {transaction.status ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
              
              {userTransactions.length > 10 && (
                <div className="text-center pt-4">
                  <p className="text-gray-500">
                    Showing 10 of {userTransactions.length} transactions
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
