"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '../../store/authStore';
import api from '../../lib/axios';
import { CreditCard, DollarSign, CheckCircle, XCircle, ArrowRight, Clock } from 'lucide-react';

export default function TransactionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthStore();
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState({ isOpen: false, type: '', message: '' });
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState('Other');
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get card_id from URL params
    const card_id = searchParams.get('card_id');

    // Fetch card details
    const fetchCardDetails = async () => {
        if (!card_id || !user?.uid) return;

        try {
            const response = await api.get(`/card-details?user_id=${user.uid}`);
            const userCard = response.data.find(card => card.id === card_id);
            if (userCard) {
                setCard(userCard);
            } else {
                setNotification({
                    isOpen: true,
                    type: 'error',
                    message: 'Card not found. Please select a valid card.'
                });
            }
        } catch (err) {
            console.error('Error fetching card details:', err);
            setNotification({
                isOpen: true,
                type: 'error',
                message: 'Failed to load card details.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCardDetails();
    }, [card_id, user?.uid]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0 && !isProcessing) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            router.push('/dashboard');
        }
    }, [timeLeft, isProcessing, router]);

    // Process payment transaction
    const handleCompletePayment = async () => {
        if (!recipient || !amount || !description) {
            setNotification({
                isOpen: true,
                type: 'error',
                message: 'Please fill in all required fields.'
            });
            return;
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            setNotification({
                isOpen: true,
                type: 'error',
                message: 'Please enter a valid amount.'
            });
            return;
        }

        setIsProcessing(true);
        setNotification({ isOpen: false, type: '', message: '' });
        setTransactionStatus(null);

        try {
            const transactionData = {
                user_id: user.uid,
                card_id: card_id,
                transaction_name: description,
                description: `Payment to ${recipient}`,
                address: recipient,
                status: true,
                type: 'expense',
                amount: Number(amount),
                category: category
            };

            console.log('Processing transaction:', transactionData);

            const response = await api.post('/transactions', transactionData);

            if (response.data.success) {
                                // Update card usage statistics
                try {
                    console.log('Starting card usage update for card_id:', card_id);
                    console.log('Card object:', card);

                    // First fetch current card data to get accurate usage count
                    console.log('Fetching current card data...');
                    const currentCardResponse = await api.get(`/card-details/by-id?card_id=${card_id}`);
                    console.log('GET response status:', currentCardResponse.status);
                    console.log('GET response:', currentCardResponse);

                    const currentCard = currentCardResponse.data;
                    const currentUsageCount = currentCard.card_usage_count || 0;
                    
                    // Handle balance properly - it might be a number or string
                    let currentBalance = 0;
                    if (typeof currentCard.balance === 'string') {
                        currentBalance = parseFloat(currentCard.balance.replace(/,/g, '') || 0);
                    } else if (typeof currentCard.balance === 'number') {
                        currentBalance = currentCard.balance;
                    } else {
                        console.log('Balance is neither string nor number:', currentCard.balance);
                        currentBalance = 0;
                    }

                    console.log('Current card data:', currentCard);
                    console.log('Current card balance type:', typeof currentCard.balance);
                    console.log('Current card balance value:', currentCard.balance);

                    const updatePayload = {
                        card_usage_count: currentUsageCount + 1,
                        lastUsageTime: new Date().toISOString(),
                        balance: (currentBalance - Number(amount)).toString()
                    };
                    console.log('Update payload:', updatePayload);

                    console.log('Making PUT request...');
                    const updateResponse = await api.put(`/card-details/by-id?card_id=${card_id}`, updatePayload);
                    console.log('PUT response:', updateResponse);
                    console.log('PUT response data:', updateResponse.data);

                    console.log('Updated usage count to:', currentUsageCount + 1);
                } catch (usageError) {
                    console.error('Failed to update card usage statistics:', usageError);
                    console.error('Error details:', usageError.response?.data || usageError.message);
                    // Don't fail the transaction if usage update fails
                }

                setTransactionStatus({
                    success: true,
                    transactionId: response.data.transaction?.id,
                    message: `Payment of ₹${amount} to ${recipient} processed successfully!`
                });

                setNotification({
                    isOpen: true,
                    type: 'success',
                    message: 'Transaction completed successfully!'
                });

                // Redirect after success
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
            } else {
                throw new Error('Transaction processing failed');
            }
        } catch (error) {
            console.error('Transaction error:', error);
            setTransactionStatus({
                success: false,
                error: error.message || 'Transaction failed. Please try again.'
            });
            setNotification({
                isOpen: true,
                type: 'error',
                message: error.message || 'Transaction failed. Please try again.'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading transaction details...</p>
                </div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Card Not Found</h2>
                    <p className="text-gray-600 mb-4">The selected card could not be found.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Timer */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-white" />
                            <h1 className="text-xl font-bold text-white">Quick Payment</h1>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-100 bg-blue-800 px-3 py-1 rounded-full">
                            <Clock className="w-4 h-4" />
                            <span>Time remaining: {formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Selected Card Display */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Selected Card</h2>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <CreditCard className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="font-medium text-gray-900">{card.cardName}</p>
                            <p className="text-sm text-gray-600">
                                **** **** **** {card.cardNumber?.slice(-4) || '****'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transaction Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>

                    {notification.isOpen && (
                        <div className={`mb-4 p-4 rounded-lg border ${
                            notification.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                            {notification.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Recipient */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Recipient
                            </label>
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="Enter recipient name or account"
                                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                disabled={isProcessing}
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                disabled={isProcessing}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                disabled={isProcessing}
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

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter payment description"
                                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                disabled={isProcessing}
                            />
                        </div>
                    </div>

                    {/* Process Payment Button */}
                    <button
                        onClick={handleCompletePayment}
                        disabled={isProcessing || !recipient || !amount || !description}
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
                                Complete Payment
                            </>
                        )}
                    </button>
                </div>

                {/* Transaction Status */}
                {transactionStatus && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Transaction Status</h2>
                        <div className={`p-4 rounded-lg border ${
                            transactionStatus.success
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                {transactionStatus.success ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span className={`font-medium ${
                                    transactionStatus.success ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {transactionStatus.success ? 'Payment Successful' : 'Payment Failed'}
                                </span>
                            </div>
                            <p className={`text-sm ${
                                transactionStatus.success ? 'text-green-700' : 'text-red-700'
                            }`}>
                                {transactionStatus.message}
                            </p>
                            {transactionStatus.transactionId && (
                                <p className="text-xs text-gray-600 mt-2">
                                    Transaction ID: {transactionStatus.transactionId}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
