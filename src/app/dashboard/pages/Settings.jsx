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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Configure your intelligent card organization system</p>
      </div>

      {/* Current Context */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Current Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
              {currentContext?.location?.name || 'Unknown Location'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
              {new Date(currentContext?.time || Date.now()).toLocaleString()}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Device</label>
            <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
              {currentContext?.deviceType || 'Unknown'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Network</label>
            <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
              {currentContext?.networkType || 'Unknown'}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={onRefreshLocation}
            variant="outline"
            size="sm"
          >
            Refresh Location
          </Button>
        </div>
      </div>

      {/* AI Learning Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">AI Learning Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Adaptive Learning</label>
              <p className="text-sm text-gray-500">Allow the system to learn from your card usage patterns</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableAdaptiveLearning}
              onChange={(e) => handleSettingChange('enableAdaptiveLearning', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Learning Rate</label>
              <p className="text-sm text-gray-500">How quickly the AI adapts to your preferences</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={settings.learningRate}
                onChange={(e) => handleSettingChange('learningRate', parseFloat(e.target.value))}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 w-12">{settings.learningRate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">AI Confidence</label>
              <p className="text-sm text-gray-500">Current confidence level of AI predictions</p>
            </div>
            <div className="text-sm font-medium">
              {personalizationModel?.confidence ? (personalizationModel.confidence * 100).toFixed(0) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Privacy & Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Location Tracking</label>
              <p className="text-sm text-gray-500">Use location data to improve card recommendations</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableLocationTracking}
              onChange={(e) => handleSettingChange('enableLocationTracking', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto-refresh Location</label>
              <p className="text-sm text-gray-500">Automatically update location context</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoRefreshLocation}
              onChange={(e) => handleSettingChange('autoRefreshLocation', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Card Organization */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Card Organization</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Declutter</label>
              <p className="text-sm text-gray-500">Automatically hide rarely used cards</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableDeclutter}
              onChange={(e) => handleSettingChange('enableDeclutter', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Max Hidden Cards</label>
              <p className="text-sm text-gray-500">Maximum number of cards to hide in declutter mode</p>
            </div>
            <input
              type="number"
              min="1"
              max="50"
              value={settings.maxHiddenCards}
              onChange={(e) => handleSettingChange('maxHiddenCards', parseInt(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Export Learning Data</label>
              <p className="text-sm text-gray-500">Download your personalization data for backup</p>
            </div>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Reset AI Learning</label>
              <p className="text-sm text-gray-500">Clear all learned preferences and start fresh</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetLearning}
              className="text-red-600 hover:text-red-700"
            >
              Reset Learning
            </Button>
          </div>
        </div>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Cancel
        </Button>
        <Button>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
