import React from 'react';
import { CreditCard, Activity, User, TrendingUp, Settings, Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  type = 'default', 
  message = 'Loading...', 
  subtitle = 'Please wait a moment',
  fullScreen = true,
  size = 'large' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-10 h-10 text-white animate-pulse" />;
      case 'profile':
        return <User className="w-10 h-10 text-white animate-pulse" />;
      case 'transactions':
        return <Activity className="w-10 h-10 text-white animate-pulse" />;
      case 'analytics':
        return <TrendingUp className="w-10 h-10 text-white animate-pulse" />;
      case 'settings':
        return <Settings className="w-10 h-10 text-white animate-pulse" />;
      default:
        return <Loader2 className="w-10 h-10 text-white animate-spin" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'card':
        return 'bg-blue-600';
      case 'profile':
        return 'bg-green-600';
      case 'transactions':
        return 'bg-purple-600';
      case 'analytics':
        return 'bg-indigo-600';
      case 'settings':
        return 'bg-gray-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'card':
        return 'from-blue-500 to-blue-600';
      case 'profile':
        return 'from-green-500 to-green-600';
      case 'transactions':
        return 'from-purple-500 to-purple-600';
      case 'analytics':
        return 'from-indigo-500 to-indigo-600';
      case 'settings':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const containerClass = fullScreen 
    ? "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
    : "flex items-center justify-center py-12";

  const sizeClasses = {
    small: { circle: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-base', subtitle: 'text-sm' },
    medium: { circle: 'w-20 h-20', icon: 'w-10 h-10', text: 'text-lg', subtitle: 'text-base' },
    large: { circle: 'w-24 h-24', icon: 'w-12 h-12', text: 'text-xl', subtitle: 'text-lg' }
  };

  const currentSize = sizeClasses[size] || sizeClasses.large;

  return (
    <div className={containerClass}>
      <div className="text-center max-w-md mx-auto px-4">
        <div className="relative">
          {/* Animated background circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-40 h-40 bg-gradient-to-br ${getGradient()} rounded-full animate-ping opacity-10`}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-32 h-32 bg-gradient-to-br ${getGradient()} rounded-full animate-ping opacity-20`} style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-28 h-28 bg-gradient-to-br ${getGradient()} rounded-full animate-ping opacity-30`} style={{ animationDelay: '1s' }}></div>
          </div>
          
          {/* Main loader */}
          <div className="relative">
            <div className={`${currentSize.circle} mx-auto mb-6 bg-gradient-to-br ${getGradient()} rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
              {React.cloneElement(getIcon(), {
                className: `${currentSize.icon} text-white ${type === 'default' ? 'animate-spin' : 'animate-pulse'}`
              })}
            </div>
          </div>
          
          {/* Bouncing dots */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 bg-gradient-to-br ${getGradient()} rounded-full animate-bounce shadow-lg`}></div>
              <div className={`w-3 h-3 bg-gradient-to-br ${getGradient()} rounded-full animate-bounce shadow-lg`} style={{ animationDelay: '0.1s' }}></div>
              <div className={`w-3 h-3 bg-gradient-to-br ${getGradient()} rounded-full animate-bounce shadow-lg`} style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            {/* Text content */}
            <div className="space-y-3">
              <h3 className={`${currentSize.text} font-bold text-gray-800 tracking-wide`}>{message}</h3>
              <p className={`${currentSize.subtitle} text-gray-600 leading-relaxed`}>{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for inline loading
export const CompactLoader = ({ 
  type = 'default', 
  message = 'Loading...',
  className = '' 
}) => {
  const getGradient = () => {
    switch (type) {
      case 'card':
        return 'from-blue-500 to-blue-600';
      case 'profile':
        return 'from-green-500 to-green-600';
      case 'transactions':
        return 'from-purple-500 to-purple-600';
      case 'analytics':
        return 'from-indigo-500 to-indigo-600';
      case 'settings':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getGradient()} animate-spin border-2 border-white shadow-lg`}>
        <div className="w-2 h-2 bg-white rounded-full ml-1 mt-1"></div>
      </div>
      <span className="text-gray-700 font-medium">{message}</span>
    </div>
  );
};

// Skeleton loader for cards
export const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
    </div>
    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4"></div>
      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20"></div>
    </div>
    <div className="mt-4 flex space-x-2">
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

// Skeleton loader for transactions
export const TransactionSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-4 animate-pulse border border-gray-100 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
      </div>
      <div className="text-right space-y-2">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-12"></div>
      </div>
    </div>
  </div>
);

// Page transition loader
export const PageTransitionLoader = ({ message = 'Loading page...' }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full bg-white"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        </div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
