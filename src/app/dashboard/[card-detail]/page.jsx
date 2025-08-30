// src/app/dashboard/pages/CardDetailsPage.jsx
"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Lock,
  Settings,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Smartphone,
  Car,
  Coffee,
  Heart,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import QuickActions from "../components/QuickActions";
import UsageOverview from "../components/UsageOverView";
import RecentTransactions from "../components/RecentTransactions";
import SecurityPrivacy from "../components/SecurityPrivacy";
import SmartSuggestions from "../components/SmartSuggestionsSection";
import LoadingSpinner from "../../../components/LoadingSpinner";
import api from "../../../lib/axios";

// Import the UnifiedCard component
import UnifiedCard from "../components/myCards";
import Link from "next/link";

const CardDetailsPage = () => {
  const [cardInfo, setCardInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transformedTransactions, setTransformedTransactions] = useState([]);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const cardId = params["card-detail"];

  // Transform transaction data to match component expectations
  const transformTransactionData = (rawTransactions) => {
    return rawTransactions.map((transaction, index) => {
      // Determine icon and color based on transaction name or category
      const getTransactionIcon = (name, category) => {
        const lowerName = name.toLowerCase();
        const lowerCategory = category?.toLowerCase() || "";

        if (
          lowerName.includes("coffee") ||
          lowerName.includes("starbucks") ||
          lowerCategory.includes("restaurant")
        ) {
          return { icon: Coffee, color: "text-green-600" };
        } else if (
          lowerName.includes("amazon") ||
          lowerName.includes("shop") ||
          lowerCategory.includes("shopping")
        ) {
          return { icon: ShoppingCart, color: "text-blue-600" };
        } else if (
          lowerName.includes("gas") ||
          lowerName.includes("fuel") ||
          lowerCategory.includes("gas")
        ) {
          return { icon: Car, color: "text-yellow-600" };
        } else if (
          lowerName.includes("netflix") ||
          lowerName.includes("streaming") ||
          lowerCategory.includes("subscription")
        ) {
          return { icon: Smartphone, color: "text-purple-600" };
        } else if (
          lowerName.includes("restaurant") ||
          lowerName.includes("food") ||
          lowerCategory.includes("food")
        ) {
          return { icon: Heart, color: "text-red-600" };
        } else if (
          lowerName.includes("payment") ||
          lowerName.includes("college") ||
          lowerName.includes("tuition")
        ) {
          return { icon: CreditCard, color: "text-blue-600" };
        } else {
          return { icon: DollarSign, color: "text-gray-600" };
        }
      };

      const iconInfo = getTransactionIcon(
        transaction.transaction_name,
        transaction.category
      );

      // Format transaction date
      let dateText = "Unknown";
      if (transaction.created_at?.seconds) {
        const transactionDate = new Date(transaction.created_at.seconds * 1000);
        const now = new Date();
        const diffDays = Math.floor(
          (now - transactionDate) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) dateText = "Today";
        else if (diffDays === 1) dateText = "Yesterday";
        else if (diffDays < 7) dateText = `${diffDays} days ago`;
        else dateText = transactionDate.toLocaleDateString();
      }

      return {
        id: transaction.transaction_id || transaction.id || index,
        merchant: transaction.transaction_name,
        date: dateText,
        amount: `₹${Math.abs(transaction.amount).toLocaleString()}`,
        status: transaction.status ? "Completed" : "Pending",
        icon: iconInfo.icon,
        color: iconInfo.color,
        type: transaction.transaction_type || "debit",
        category: transaction.category || "other",
      };
    });
  };

  // Transform cardInfo to match UnifiedCard props
  const transformCardData = (cardData) => {
    if (!cardData) return null;

    const lastUsed = cardData.lastUsageTime?.toDate?.();
    const expiryDate = cardData.expiryDate?.toDate?.();

    // Format last used date
    let lastUsedText = null;
    if (lastUsed) {
      const now = new Date();
      const diffDays = Math.floor((now - lastUsed) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) lastUsedText = "today";
      else if (diffDays === 1) lastUsedText = "yesterday";
      else if (diffDays < 7) lastUsedText = `${diffDays} days ago`;
      else lastUsedText = lastUsed.toLocaleDateString();
    }

    // Determine card type and icon
    const getCardIcon = (cardName) => {
      const name = cardName?.toLowerCase() || "";
      if (name.includes("credit")) return CreditCard;
      if (name.includes("wallet") || name.includes("digital")) return Wallet;
      return CreditCard;
    };

    return {
      type: cardData.card_type || "Credit Card",
      name: cardData.card_name || "Card",
      number: cardData.card_number?.slice(-4) || "0000", // Last 4 digits
      balance: cardData.balance || 0,
      limit: cardData.credit_limit || null,
      expires: expiryDate
        ? `${String(expiryDate.getMonth() + 1).padStart(2, "0")}/${String(
            expiryDate.getFullYear()
          ).slice(-2)}`
        : null,
      lastUsed: lastUsedText,
      status: cardData.status || "active",
      icon: getCardIcon(cardData.card_name),
      usageCount: cardData.card_usage_count || 0,
      locations: cardData.location || [],
      onDetailsClick: () => {
        // Already on details page, maybe scroll to transactions
        const transactionsElement = document.getElementById(
          "transactions-section"
        );
        if (transactionsElement) {
          transactionsElement.scrollIntoView({ behavior: "smooth" });
        }
      },
    };
  };

  useEffect(() => {
    if (!cardId) return;

    const fetchCardData = async () => {
      try {
        const res = await api.get(`/card-details/by-id?card_id=${cardId}`);
        setCardInfo(res.data);
      } catch (err) {
        console.error("Error fetching card data:", err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/transactions?card_id=${cardId}`);
        console.log("Transactions fetched:", res.data);
        setTransactions(res.data);

        // Transform the transactions for the component
        const transformed = transformTransactionData(res.data);
        setTransformedTransactions(transformed);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchCardData();
    fetchTransactions();
  }, [cardId]);

  if (!cardInfo)
    return (
      <LoadingSpinner
        type="card"
        message="Loading Card Details"
        subtitle="Please wait while we fetch your card information..."
        fullScreen={true}
      />
    );
  const handlePaymentClick = () => {
    try {
      // ✅ Pass the cardId to the transaction page
      router.push(`/transaction?card_id=${cardId}`);
      console.log("Navigating to transaction page from card details with cardId:", cardId);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  // Generate smart suggestions based on real data
  const generateSmartSuggestions = () => {
    const suggestions = [];

    // Transaction pattern suggestion
    if (transactions.length > 0) {
      const totalAmount = transactions.reduce(
        (sum, t) => sum + Math.abs(t.amount),
        0
      );
      suggestions.push({
        id: 1,
        type: "spending",
        title: "Transaction History Available",
        description: `You have ${
          transactions.length
        } transactions totaling ₹${totalAmount.toLocaleString()}. Review your spending patterns.`,
        action: "View Spending Analysis",
      });
    }

    // Location-based suggestion
    if (cardInfo.location_track && cardInfo.location?.length > 0) {
      suggestions.push({
        id: 2,
        type: "location",
        title: "Location Services Enabled",
        description: `Your card works in ${cardInfo.location.join(
          ", "
        )}. Use it for location-based rewards!`,
        action: "View Nearby Offers",
      });
    }

    // Balance suggestion
    if (cardInfo.balance > 1000) {
      suggestions.push({
        id: 3,
        type: "investment",
        title: "High Balance Detected",
        description: `Consider optimizing your balance of ₹${cardInfo.balance.toLocaleString()} for better returns.`,
        action: "Explore Options",
      });
    }

    return suggestions.slice(0, 3);
  };

  const handleNavigation = async (path) => {
    setNavigationLoading(true);
    try {
      await router.push(path);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setTimeout(() => {
        setNavigationLoading(false);
      }, 500);
    }
  };

  const handlePinToDashboard = async () => {
    setPinLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Add your pin to dashboard logic here
      console.log("Pinned to dashboard");
    } catch (error) {
      console.error("Pin error:", error);
    } finally {
      setPinLoading(false);
    }
  };

  const transformedCardData = transformCardData(cardInfo);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => handleNavigation("/dashboard")}
                disabled={navigationLoading}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4 cursor-pointer transition-colors duration-200 hover:bg-gray-100 px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                {navigationLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-1"></div>
                ) : (
                  <ArrowLeft className="h-5 w-5 mr-1" />
                )}
                Back to Cards
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {cardInfo.card_name || "Card Details"}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePinToDashboard}
                disabled={pinLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2">
                {pinLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : null}
                {pinLoading ? "Pinning..." : "Pin to Dashboard"}
              </button>
              {/* Removed Make Payment and Make Payment (Alt) from top bar */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Card Display and Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Use UnifiedCard instead of CardDisplay */}
            <div className="bg-transparent">
              {transformedCardData && <UnifiedCard {...transformedCardData} />}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* <QuickActions cardId={cardId} onPaymentClick={handlePaymentClick} /> */}
            </div>
            {/* ✅ Add Payment Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
              <h3 className="font-medium text-gray-900 mb-3">Quick Payment</h3>
              <button
                onClick={handlePaymentClick}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Make BlockDAG Payment
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Transfer BDAG tokens using this card
              </p>
            </div>
          </div>

          {/* Right Column - Details and Transactions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <UsageOverview
                data={{
                  lastUsed: transformedCardData?.lastUsed || "N/A",
                  location: cardInfo.location?.[0] || "Unknown",
                  thisWeek: {
                    times: cardInfo.card_usage_count || 0,
                    amount: `₹${cardInfo.balance?.toLocaleString() || "0"}`,
                  },
                  mostUsedAt:
                    transactions.length > 0 ? "Recent Activity" : "No Activity",
                  transactionPercentage: `${transactions.length} transactions`,
                }}
              />
            </div>

            <div
              id="transactions-section"
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <RecentTransactions transactions={transformedTransactions} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <SecurityPrivacy />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <SmartSuggestions suggestions={generateSmartSuggestions()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
