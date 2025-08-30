// components/SmartSuggestions.jsx
import React from 'react';
import Card from './Card';
import Badge from './Badge';

const SmartSuggestions = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  badge, 
  badgeVariant = 'info',
  actionText,
  onAction,
}) => (
  <Card className="p-6 rounded-2xl shadow-xl border-0 bg-gradient-to-r from-[#f7fafc] via-[#e3e8ee] to-[#cfd8dc] cursor-pointer transition-transform hover:scale-[1.03]" onClick={onAction}>
    <div className="flex items-center gap-6">
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-400 via-purple-300 to-pink-200 flex items-center justify-center shadow">
        <Icon className="h-9 w-9 text-white drop-shadow" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </div>
        <p className="text-base text-gray-600 mb-1">{subtitle}</p>
        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg inline-block">{actionText}</span>
      </div>
    </div>
  </Card>
);

export default SmartSuggestions;
