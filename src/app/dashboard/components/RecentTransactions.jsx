// src/app/dashboard/components/RecentTransactions.jsx
import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </button>
        </div>
      </div>

      <div className="divide-y">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${getIconBgColor(transaction.color)}`}>
                  <transaction.icon className={`h-5 w-5 ${transaction.color}`} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{transaction.merchant}</div>
                  <div className="text-sm text-gray-500">{transaction.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{transaction.amount}</div>
                  <div className="text-sm text-green-600">{transaction.status}</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getIconBgColor = (textColor) => {
  const colorMap = {
    'text-green-600': 'bg-green-100',
    'text-blue-600': 'bg-blue-100',
    'text-red-600': 'bg-red-100',
    'text-yellow-600': 'bg-yellow-100',
    'text-purple-600': 'bg-purple-100',
  };
  return colorMap[textColor] || 'bg-gray-100';
};

export default RecentTransactions;