"use client";

import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import api from "../../lib/axios";
import { useRouter } from 'next/navigation';
import { CreditCard, DollarSign, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [error, setError] = useState('');

  // Fetch user's cards
  const fetchCards = async () => {
    try {
      if (!user?.uid) return;
      const response = await api.get(`/card-details?user_id=${user.uid}`);
      setCards(response.data);
      if (response.data.length > 0) {
        setSelectedCard(response.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to load cards');
    }
  };

  // Process payment transaction
  const processPayment = async () => {
    if (!selectedCard || !recipient || !amount || !description) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setError('');
    setTransactionStatus(null);

    try {
      const transactionData = {
        user_id: user.uid,
        card_id: selectedCard,
        transaction_name: description,
        description: `Payment to ${recipient}`,
        address: recipient,
        status: true,
        amount: Number(amount),
        type: 'expense',
        category: category
      };

      const response = await api.post('/transactions', transactionData);

      if (response.data.success) {
        setTransactionStatus({
          success: true,
          message: `Payment of ₹${amount} to ${recipient} processed successfully!`,
          transactionId: response.data.transaction?.id
        });

        // Reset form
        setRecipient('');
        setAmount('');
        setDescription('');
        setCategory('Other');

        // Refresh transactions
        fetchTransactions();
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setTransactionStatus({
        success: false,
        message: err.response?.data?.error || 'Payment processing failed'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      if (!user?.uid) return;
      const res = await api.get(`/transactions?user_id=${user.uid}`);
      setTransactions(res?.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchCards();
      fetchTransactions();
    }
  }, [user?.uid]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Payment System</h2>
        <p className="text-gray-600">Make secure payments using your intelligent card organizer</p>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Make a Payment
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Card Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Card
              </label>
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a card...</option>
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.cardName} (**** **** **** {card.cardNumber?.slice(-4) || '****'})
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Shopping">Shopping</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient name or account"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter payment description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Process Payment Button */}
          <button
            onClick={processPayment}
            disabled={isProcessing || !selectedCard || !recipient || !amount || !description}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Process Payment
              </>
            )}
          </button>
        </div>

        {/* Transaction Status */}
        {transactionStatus && (
          <div className={`p-4 rounded-lg border ${
            transactionStatus.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {transactionStatus.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={`font-medium ${
                transactionStatus.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {transactionStatus.message}
              </p>
            </div>
            {transactionStatus.transactionId && (
              <p className="text-sm text-gray-600 mt-1">
                Transaction ID: {transactionStatus.transactionId}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-600" />
          Recent Transactions
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found.</p>
            <p className="text-sm text-gray-400 mt-1">Your payment history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((txn) => (
              <div
                key={txn.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{txn.transaction_name}</h4>
                    <p className="text-sm text-gray-600">{txn.description || txn.address}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(txn.created_at?.seconds * 1000 || txn.created_at).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        txn.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {txn.category || 'Other'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {txn.type === 'income' ? '+' : '-'}₹{txn.amount}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {txn.status ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs ${
                        txn.status ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.status ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
