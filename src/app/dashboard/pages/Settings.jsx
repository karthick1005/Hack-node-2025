// Settings Page Component
import React, { useState } from 'react';
import Button from '../components/Button';

const Settings = ({
  userPreferences,
  personalizationModel,
  onRefreshLocation,
  onResetLearning,
  currentContext
}) => {
  const [settings, setSettings] = useState({
    enableLocationTracking: true,
    enableAdaptiveLearning: true,
    enableDeclutter: true,
    maxHiddenCards: 10,
    learningRate: 0.1,
    autoRefreshLocation: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleResetLearning = () => {
    if (window.confirm('Are you sure you want to reset all learning data? This will clear your personalization preferences.')) {
      onResetLearning();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-lg text-gray-600">Configure your intelligent card organization system</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Current Context */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Current Context
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="text-sm text-gray-900 font-medium">
                  {currentContext?.location?.name || 'Unknown Location'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <div className="text-sm text-gray-900 font-medium">
                  {new Date(currentContext?.time || Date.now()).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Device</label>
                <div className="text-sm text-gray-900 font-medium">
                  {currentContext?.deviceType || 'Unknown'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                <div className="text-sm text-gray-900 font-medium">
                  {currentContext?.networkType || 'Unknown'}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={onRefreshLocation}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-50 border-gray-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Location
              </Button>
            </div>
          </div>
        </div>

        {/* AI Learning Settings */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Learning Settings
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 block mb-1">Enable Adaptive Learning</label>
                <p className="text-sm text-gray-600">Allow the system to learn from your card usage patterns</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAdaptiveLearning}
                  onChange={(e) => handleSettingChange('enableAdaptiveLearning', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 block mb-1">Learning Rate</label>
                <p className="text-sm text-gray-600">How quickly the AI adapts to your preferences</p>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={settings.learningRate}
                  onChange={(e) => handleSettingChange('learningRate', parseFloat(e.target.value))}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-900 w-12 text-center">{settings.learningRate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 block mb-1">AI Confidence</label>
                <p className="text-sm text-gray-600">Current confidence level of AI predictions</p>
              </div>
              <div className="text-lg font-bold text-purple-600">
                {personalizationModel?.confidence ? (personalizationModel.confidence * 100).toFixed(0) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy & Security
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 block mb-1">Enable Location Tracking</label>
                <p className="text-sm text-gray-600">Use location data to improve card recommendations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableLocationTracking}
                  onChange={(e) => handleSettingChange('enableLocationTracking', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 block mb-1">Auto-refresh Location</label>
                <p className="text-sm text-gray-600">Automatically update location context</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoRefreshLocation}
                  onChange={(e) => handleSettingChange('autoRefreshLocation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Card Organization */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Card Organization
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 block mb-1">Enable Declutter</label>
                <p className="text-sm text-gray-600">Automatically hide rarely used cards</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDeclutter}
                  onChange={(e) => handleSettingChange('enableDeclutter', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 block mb-1">Max Hidden Cards</label>
                <p className="text-sm text-gray-600">Maximum number of cards to hide in declutter mode</p>
              </div>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.maxHiddenCards}
                onChange={(e) => handleSettingChange('maxHiddenCards', parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Data Management
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 block mb-1">Export Learning Data</label>
                <p className="text-sm text-gray-600">Download your personalization data for backup</p>
              </div>
              <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-gray-300">
                Export Data
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 block mb-1">Reset AI Learning</label>
                <p className="text-sm text-gray-600">Clear all learned preferences and start fresh</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetLearning}
                className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
              >
                Reset Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button variant="outline" className="px-6 py-2">
            Cancel
          </Button>
          <Button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
