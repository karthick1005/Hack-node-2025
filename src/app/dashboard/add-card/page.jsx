'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Save } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import api from '../../../lib/axios';
import Button from '../components/Button';
import Card from '../components/Card';

const AddCardPage = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    card_name: '',
    card_type: 'Debit',
    card_number: '',
    card_description: '',
    balance: '',
    pin: '',
    expiryDate: '',
    location: '',
    card_status: true,
    location_track: false,
    transaction_alert: true,
    card_usage_count: 0
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare the data in your Firestore format
      const cardData = {
        user_id: user.uid,
        userName: user.displayName || 'Unknown User',
        card_name: formData.card_name,
        card_type: formData.card_type,
        card_number: formData.card_number,
        card_description: formData.card_description,
        balance: parseFloat(formData.balance) || 0,
        pin: parseInt(formData.pin) || 0,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        location: formData.location ? formData.location.split(',').map(loc => loc.trim()) : [],
        card_status: formData.card_status,
        location_track: formData.location_track,
        transaction_alert: formData.transaction_alert,
        card_usage_count: formData.card_usage_count,
        lastUsageTime: new Date().toISOString()
      };

      console.log('Sending card data:', cardData);

      const response = await api.post('/card-details', cardData);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Add card error:', err);
      setError(err.response?.data?.error || 'Failed to add card');
    } finally {
      setLoading(false);
    }
  };

  // Demo data button handler
  const fillDemoData = () => {
    setFormData({
      card_name: 'SBI Gift Card',
      card_type: 'Gift',
      card_number: '1234-5678-9012-3456',
      card_description: 'Gain more rewards with SBI gift card',
      balance: '1000',
      pin: '1234',
      expiryDate: '2027-04-30',
      location: 'Chennai, Coimbatore',
      card_status: true,
      location_track: true,
      transaction_alert: true,
      card_usage_count: 0 // Start with 0 for demo data too
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Card Added Successfully!</h2>
          <p className="text-gray-600 mb-4">Your card has been added to your collection.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className='flex gap-4'>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Card</h1>
          </div>
             <div className="flex justify-end">
              <button
               type="button"
                className='p-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                onClick={fillDemoData}
              >
                Fill Demo Data
              </button>
            </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Demo Data Button */}
         

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Card Name *
                </label>
                <input
                  type="text"
                  name="card_name"
                  value={formData.card_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., SBI Smart Card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Card Type *
                </label>
                <select
                  name="card_type"
                  value={formData.card_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Debit">Debit</option>
                  <option value="Credit">Credit</option>
                  <option value="Loyalty">Loyalty</option>
                  <option value="Gift">Gift</option>
                  <option value="Travel">Travel</option>
                  <option value="Crypto">Crypto</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                name="card_number"
                value={formData.card_number}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="1234-5678-9012-3456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Description
              </label>
              <textarea
                name="card_description"
                value={formData.card_description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Card description or benefits"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Balance
                </label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  PIN
                </label>
                <input
                  type="password"
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                  maxLength="4"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Locations (comma-separated)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Chennai, Coimbatore, Mumbai"
              />
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="card_status"
                  checked={formData.card_status}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Card is active</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="location_track"
                  checked={formData.location_track}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Enable location tracking</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="transaction_alert"
                  checked={formData.transaction_alert}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Enable transaction alerts</label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Card
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddCardPage;
