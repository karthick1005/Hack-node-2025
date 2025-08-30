// src/app/dashboard/components/SmartSuggestionsSection.jsx
import React from 'react';
import { Lightbulb, Utensils, RotateCcw, TrendingUp } from 'lucide-react';
import SmartSuggestions from './SmartSuggestions'; // Your existing component

const SmartSuggestionsSection = ({ suggestions }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'restaurant':
        return Utensils;
      case 'recurring':
        return RotateCcw;
      case 'spending':
        return TrendingUp;
      default:
        return Lightbulb;
    }
  };

  const getIconProps = (type) => {
    switch (type) {
      case 'restaurant':
        return { iconBg: 'bg-orange-50', iconColor: 'text-orange-600' };
      case 'recurring':
        return { iconBg: 'bg-blue-50', iconColor: 'text-blue-600' };
      case 'spending':
        return { iconBg: 'bg-green-50', iconColor: 'text-green-600' };
      default:
        return { iconBg: 'bg-purple-50', iconColor: 'text-purple-600' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Smart Suggestions</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const Icon = getIcon(suggestion.type);
          const iconProps = getIconProps(suggestion.type);
          
          return (
            <SmartSuggestions
              key={suggestion.id}
              icon={Icon}
              title={suggestion.title}
              subtitle={suggestion.description}
              actionText={suggestion.action}
              badge="New"
              badgeVariant="info"
              onAction={() => console.log('Suggestion action:', suggestion.action)}
              {...iconProps}
            />
          );
        })}
      </div>

      <div className="pt-4 border-t">
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">View Insights</span>
        </button>
      </div>
    </div>
  );
};

export default SmartSuggestionsSection;