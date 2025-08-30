// Analytics Page Component
import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = ({
  usagePatterns,
  analytics,
  rankedCards,
  personalizationModel
}) => {
  // Usage by hour chart
  const hourlyUsageData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Card Usage by Hour',
      data: Array.from({ length: 24 }, (_, i) => usagePatterns?.byHour?.[i] || 0),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }],
  };

  // Category usage chart
  const categoryData = {
    labels: Object.keys(analytics?.categoryUsage || {}),
    datasets: [{
      data: Object.values(analytics?.categoryUsage || {}),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
    }],
  };

  // Learning progress chart
  const learningData = {
    labels: ['Frequency', 'Recency', 'Context Match', 'User Preference', 'Time of Day', 'Location'],
    datasets: [{
      label: 'Learning Weights',
      data: [
        personalizationModel?.weights?.frequency || 0,
        personalizationModel?.weights?.recency || 0,
        personalizationModel?.weights?.contextMatch || 0,
        personalizationModel?.weights?.userPreference || 0,
        personalizationModel?.weights?.timeOfDay || 0,
        personalizationModel?.weights?.location || 0,
      ].map(w => w * 100),
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Insights from your intelligent card usage patterns</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{analytics?.totalCards || 0}</div>
          <div className="text-sm text-gray-500">Total Cards</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{analytics?.activeCards || 0}</div>
          <div className="text-sm text-gray-500">Active Cards</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{analytics?.totalUsage || 0}</div>
          <div className="text-sm text-gray-500">Total Usage</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {analytics?.averageUsage ? analytics.averageUsage.toFixed(1) : 0}
          </div>
          <div className="text-sm text-gray-500">Avg Usage/Card</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {personalizationModel?.confidence ? (personalizationModel.confidence * 100).toFixed(0) : 0}%
          </div>
          <div className="text-sm text-gray-500">AI Confidence</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Usage */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Usage by Hour</h3>
          <Bar data={hourlyUsageData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              y: { beginAtZero: true }
            }
          }} />
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Usage by Category</h3>
          <Doughnut data={categoryData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
            }
          }} />
        </div>

        {/* Learning Progress */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">AI Learning Weights</h3>
          <Bar data={learningData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Weight (%)' }
              }
            }
          }} />
        </div>
      </div>

      {/* Top Cards */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Performing Cards</h3>
        <div className="space-y-3">
          {rankedCards?.primary?.slice(0, 5).map((card, index) => (
            <div key={card.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{card.cardName}</div>
                  <div className="text-sm text-gray-500">{card.cardType}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{card.score?.toFixed(2)}</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Insights */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Location-Based Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(usagePatterns?.byLocation || {}).slice(0, 6).map(([location, count]) => (
            <div key={location} className="p-4 bg-gray-50 rounded">
              <div className="font-medium text-lg">{count}</div>
              <div className="text-sm text-gray-600 truncate">{location}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
