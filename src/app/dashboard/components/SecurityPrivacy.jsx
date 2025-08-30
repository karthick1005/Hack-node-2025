// src/app/dashboard/components/SecurityPrivacy.jsx
import React, { useState } from 'react';
import { Shield, MapPin, Bell, ShoppingCart, Eye } from 'lucide-react';

const SecurityPrivacy = () => {
  const [settings, setSettings] = useState({
    locationTracking: true,
    transactionAlerts: true,
    onlinePurchases: true
  });

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const securityItems = [
    {
      key: 'locationTracking',
      icon: MapPin,
      title: 'Location Tracking',
      description: 'Enable fraud protection based on location',
      enabled: settings.locationTracking
    },
    {
      key: 'transactionAlerts',
      icon: Bell,
      title: 'Transaction Alerts',
      description: 'Get instant alerts for all transactions',
      enabled: settings.transactionAlerts
    },
    {
      key: 'onlinePurchases',
      icon: ShoppingCart,
      title: 'Online Purchases',
      description: 'Enable online and international purchases',
      enabled: settings.onlinePurchases
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
        </div>
      </div>

      <div className="divide-y">
        {securityItems.map((item) => (
          <div key={item.key} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting(item.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  item.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    item.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t">
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">View data permissions</span>
        </button>
      </div>
    </div>
  );
};

export default SecurityPrivacy;