import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Filter,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Smartphone,
  MoreHorizontal,
  Gamepad2,
  Heart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useAuthStore from '../../../store/authStore';
import api from '../../../lib/axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Transactions = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('30');
  const [error, setError] = useState('');
  
  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(4);

  // Category icon mapping
  const getCategoryIcon = (category) => {
    const icons = {
      'Shopping': ShoppingCart,
      'Food': Coffee,
      'Transport': Car,
      'Housing': Home,
      'Utilities': Smartphone,
      'Income': DollarSign,
      'Entertainment': Gamepad2,
      'Healthcare': Heart,
      'Education': Heart, // Using Heart for education, you could import a Book icon
      'Other Payments': CreditCard,
      'Other': MoreHorizontal
    };
    return icons[category] || MoreHorizontal;
  };

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      'Shopping': 'bg-emerald-500',
      'Food': 'bg-amber-500',
      'Transport': 'bg-blue-500',
      'Housing': 'bg-purple-500',
      'Utilities': 'bg-indigo-500',
      'Income': 'bg-green-500',
      'Entertainment': 'bg-pink-500',
      'Healthcare': 'bg-red-500',
      'Education': 'bg-purple-600',
      'Other Payments': 'bg-blue-600',
      'Other': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  // Fetch transactions data from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user?.uid) {
        setError('User not authenticated');
        return;
      }

      console.log('Fetching transactions for user:', user.uid);
      const response = await api.get(`/transactions/insights?user_id=${user.uid}`);
      
      console.log('API Response:', response.data);
      
      if (response.data) {
        setTransactions(response.data.transactions || []);
        setInsights(response.data.insights || {});
        setCards(response.data.cards || []);
      } else {
        setError('No data received from API');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      console.error('Error details:', err.response?.data);
      
      setError(`Failed to fetch transaction data: ${err.response?.data?.error || err.message}. Using demo data.`);
      
      // Fallback to demo data if API fails
      setTransactions(mockTransactions);
      setInsights(mockInsights);
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const mockTransactions = [
    {
      id: 1,
      type: 'expense',
      amount: 127.50,
      transaction_name: 'Grocery Shopping',
      category: 'Shopping',
      created_at: '2025-01-15T14:32:00.000Z',
      card_id: 'card1',
      status: true
    },
    {
      id: 2,
      type: 'income',
      amount: 2500.00,
      transaction_name: 'Salary Deposit',
      category: 'Income',
      created_at: '2025-01-15T09:00:00.000Z',
      card_id: 'card1',
      status: true
    },
    {
      id: 3,
      type: 'expense',
      amount: 45.20,
      transaction_name: 'Coffee & Breakfast',
      category: 'Food',
      created_at: '2025-01-14T08:15:00.000Z',
      card_id: 'card1',
      status: true
    },
    {
      id: 4,
      type: 'expense',
      amount: 89.99,
      transaction_name: 'Gas Station',
      category: 'Transport',
      created_at: '2025-01-14T17:45:00.000Z',
      card_id: 'card2',
      status: true
    }
  ];

  const mockInsights = {
    totalIncome: 2500.00,
    totalExpenses: 262.69,
    netBalance: 2237.31,
    expenseChange: -8.3,
    categoryTotals: {
      'Shopping': 127.50,
      'Food': 45.20,
      'Transport': 89.99
    },
    monthlyTrend: [
      { month: 'Aug', expenses: 300, income: 2400, net: 2100 },
      { month: 'Sep', expenses: 280, income: 2500, net: 2220 },
      { month: 'Oct', expenses: 320, income: 2500, net: 2180 },
      { month: 'Nov', expenses: 290, income: 2600, net: 2310 },
      { month: 'Dec', expenses: 310, income: 2500, net: 2190 },
      { month: 'Jan', expenses: 263, income: 2500, net: 2237 }
    ]
  };

  // Calculate insights from current data
  const currentInsights = insights || mockInsights;
  const { totalIncome, totalExpenses, netBalance, expenseChange, categoryTotals, monthlyTrend } = currentInsights;

  // Enhanced category processing with better categorization
  const enhancedCategoryTotals = React.useMemo(() => {
    if (!categoryTotals || Object.keys(categoryTotals).length === 0) {
      // Return empty object instead of demo data when no real data exists
      return {};
    }

    // If we only have "Other" category, try to recategorize based on transaction names
    if (Object.keys(categoryTotals).length === 1 && categoryTotals['Other']) {
      const recategorized = {};
      
      transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
          let category = 'Other';
          const name = transaction.transaction_name?.toLowerCase() || '';
          
          // Categorize based on transaction name
          if (name.includes('amazon') || name.includes('shop') || name.includes('store')) {
            category = 'Shopping';
          } else if (name.includes('college') || name.includes('school') || name.includes('education')) {
            category = 'Education';
          } else if (name.includes('food') || name.includes('restaurant') || name.includes('eat')) {
            category = 'Food';
          } else if (name.includes('transport') || name.includes('uber') || name.includes('taxi')) {
            category = 'Transport';
          } else if (name.includes('payment to')) {
            category = 'Other Payments';
          }
          
          recategorized[category] = (recategorized[category] || 0) + transaction.amount;
        }
      });

      return Object.keys(recategorized).length > 1 ? recategorized : categoryTotals;
    }

    return categoryTotals;
  }, [categoryTotals, transactions]);

  // Debug information
  console.log('Current categoryTotals:', categoryTotals);
  console.log('Enhanced categoryTotals:', enhancedCategoryTotals);
  console.log('Category count:', Object.keys(enhancedCategoryTotals).length);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.transaction_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ✅ Pagination calculations
  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // ✅ Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  // ✅ Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to transactions section
    const transactionsSection = document.getElementById('transactions-section');
    if (transactionsSection) {
      transactionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user,dateFilter]);

  if (loading) {
    return <LoadingSpinner type="transactions" size="large" />;
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transaction Analytics
            </h1>
          </div>
          <p className="text-gray-600 text-base">Comprehensive financial insights and spending analysis</p>
          {error && (
            <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full flex-shrink-0"></div>
              <p className="text-amber-700 text-sm">{error}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <div className="relative">
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 hover:border-blue-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 pr-10"
            >
              <option value="1">Last 1 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Total Income</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl shadow-sm">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-100 p-1.5 rounded-md">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-emerald-600 text-sm font-medium">+12.5% growth</span>
              <p className="text-gray-500 text-xs">vs last month</p>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Total Expenses</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-xl shadow-sm">
              <ArrowDownRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-red-100 p-1.5 rounded-md">
              {expenseChange < 0 ? (
                <TrendingDown className="w-4 h-4 text-red-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div>
              <span className="text-red-600 text-sm font-medium">
                {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}% change
              </span>
              <p className="text-gray-500 text-xs">vs last month</p>
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 ${netBalance >= 0 ? 'bg-blue-400' : 'bg-orange-400'} rounded-full`}></div>
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Net Balance</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{Math.abs(netBalance).toLocaleString()}</p>
            </div>
            <div className={`bg-gradient-to-br ${netBalance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-amber-600'} p-3 rounded-xl shadow-sm`}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`${netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} p-1.5 rounded-md`}>
              {netBalance >= 0 ? (
                <TrendingUp className={`w-4 h-4 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              ) : (
                <TrendingDown className={`w-4 h-4 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              )}
            </div>
            <div>
              <span className={`${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'} text-sm font-medium`}>
                {netBalance >= 0 ? 'Healthy savings' : 'Budget review needed'}
              </span>
              <p className="text-gray-500 text-xs">Financial status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Spending by Category - Doughnut Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Spending Categories</h3>
              <p className="text-gray-600 text-sm">Distribution analysis</p>
            </div>
            <div className="bg-blue-500 p-2 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
          </div>
          {Object.keys(enhancedCategoryTotals).length > 0 ? (
            <div className="h-72">
              <Doughnut
                data={{
                  labels: Object.keys(enhancedCategoryTotals),
                  datasets: [{
                    data: Object.values(enhancedCategoryTotals),
                    backgroundColor: [
                      '#10b981', // emerald-500
                      '#f59e0b', // amber-500
                      '#3b82f6', // blue-500
                      '#8b5cf6', // purple-500
                      '#ef4444', // red-500
                      '#6366f1', // indigo-500
                      '#ec4899', // pink-500
                      '#14b8a6', // teal-500
                      '#f97316', // orange-500
                      '#6b7280', // gray-500
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff',
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                          size: 12,
                          weight: '500'
                        },
                        color: '#374151',
                        boxHeight: 8,
                        boxWidth: 8,
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      cornerRadius: 8,
                      padding: 12,
                      titleFont: {
                        size: 13,
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 12,
                        weight: '500'
                      },
                      callbacks: {
                        label: function(context) {
                          const total = Object.values(enhancedCategoryTotals).reduce((a, b) => a + b, 0);
                          const percentage = ((context.parsed / total) * 100).toFixed(1);
                          return `${context.label}: ₹${context.parsed.toLocaleString()} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-700">No Transaction Data</h4>
                  <p className="text-gray-500 text-sm">Start making transactions to see your spending categories and insights</p>
                  <p className="text-gray-400 text-xs mt-2">Your expense breakdown will appear here once you have transaction data</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Trend - Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Financial Trends</h3>
              <p className="text-gray-600 text-sm">Monthly performance overview</p>
            </div>
            <div className="bg-emerald-500 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          {monthlyTrend && monthlyTrend.length > 0 ? (
            <div className="h-72">
              <Line
                data={{
                  labels: monthlyTrend.map(item => item.month),
                  datasets: [
                    {
                      label: 'Income',
                      data: monthlyTrend.map(item => item.income),
                      borderColor: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      tension: 0.4,
                      fill: true,
                      borderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                      pointBackgroundColor: '#10b981',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                    },
                    {
                      label: 'Expenses',
                      data: monthlyTrend.map(item => item.expenses),
                      borderColor: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      tension: 0.4,
                      fill: true,
                      borderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                      pointBackgroundColor: '#ef4444',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                    },
                    {
                      label: 'Net Balance',
                      data: monthlyTrend.map(item => item.net),
                      borderColor: '#3b82f6',
                      backgroundColor: 'transparent',
                      tension: 0.4,
                      fill: false,
                      borderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                      pointBackgroundColor: '#3b82f6',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      align: 'end',
                      labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                        font: {
                          size: 12,
                          weight: '500'
                        },
                        color: '#374151',
                        boxHeight: 6,
                        boxWidth: 6,
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      cornerRadius: 8,
                      padding: 12,
                      titleFont: {
                        size: 13,
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 12,
                        weight: '500'
                      },
                      mode: 'index',
                      intersect: false,
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      border: {
                        display: false,
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 11,
                          weight: '500'
                        }
                      }
                    },
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(156, 163, 175, 0.2)',
                        drawBorder: false,
                      },
                      border: {
                        display: false,
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 11,
                          weight: '500'
                        },
                        callback: function(value) {
                          return '₹' + value.toLocaleString();
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto">
                  <TrendingUp className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-700">No Financial Trends Available</h4>
                  <p className="text-gray-500 text-sm">Historical financial trends will appear here once you have transaction data</p>
                  <p className="text-gray-400 text-xs mt-2">Track your income and expenses over time with monthly insights</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div id="transactions-section" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions, categories, or amounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-500 text-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                filter === 'income' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                filter === 'expense' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>

        {/* ✅ Pagination Info */}
        {totalTransactions > 0 && (
          <div className="flex items-center justify-between mb-4 py-2 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, totalTransactions)}</span> of{' '}
                <span className="font-medium">{totalTransactions}</span> transactions
              </p>
            </div>
            <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
          </div>
        )}

        {/* Transaction List */}
        <div className="space-y-3">
          {currentTransactions.map((transaction) => {
            const CategoryIcon = getCategoryIcon(transaction.category);
            const categoryColor = getCategoryColor(transaction.category);
            const transactionDate = new Date(transaction.created_at);
            
            return (
              <div 
                key={transaction.id} 
                className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer hover:shadow-sm border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${categoryColor} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors duration-200">
                      {transaction.transaction_name || 'Unknown Transaction'}
                    </h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{transaction.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{transactionDate.toLocaleDateString('en-IN', { 
                          day: 'numeric',
                          month: 'short'
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{transactionDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      {transaction.status && (
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          <span className="text-emerald-600">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <p className={`text-lg font-bold transition-colors duration-200 ${
                    transaction.type === 'income' ? 'text-emerald-600 group-hover:text-emerald-700' : 'text-red-600 group-hover:text-red-700'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 font-medium capitalize bg-gray-100 px-2 py-1 rounded">
                    {transaction.type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ Pagination Controls */}
        {totalTransactions > transactionsPerPage && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const isCurrentPage = page === currentPage;
                const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                const isFirstOrLast = page === 1 || page === totalPages;
                
                if (!isNearCurrentPage && !isFirstOrLast) {
                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span key={page} className="px-2 text-gray-400">...</span>
                    );
                  }
                  return null;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isCurrentPage
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
              }`}
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">No transactions found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              <p className="text-gray-500 text-sm">Your transaction history will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
