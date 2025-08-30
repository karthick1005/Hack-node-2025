// src/app/dashboard/components/UsageOverview.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

const UsageOverview = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Last Used */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Last Used</div>
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {data.lastUsed}
          </div>
          <div className="text-sm text-gray-600">{data.location}</div>
        </div>

        {/* Used This Week */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Used This Week</div>
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {data.thisWeek.times} times
          </div>
          <div className="text-sm text-gray-600">{data.thisWeek.amount} spent</div>
        </div>

        {/* Most Used At */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Most Used At</div>
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {data.mostUsedAt}
          </div>
          <div className="text-sm text-gray-600">{data.transactionPercentage}</div>
        </div>
      </div>

      {/* Monthly Spending Chart Placeholder */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-700">Monthly Spending</div>
          <div className="text-sm text-gray-500">Limit: ₹9,000.00</div>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: '27%' }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>₹2,450.78</span>
          <span>₹9,000.00</span>
        </div>
      </div>
    </div>
  );
};

export default UsageOverview;