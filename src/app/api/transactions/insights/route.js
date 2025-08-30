import { db } from "../../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";

// Get transaction insights with analytics
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    console.log('Fetching transactions for user_id:', user_id);

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
      });
    }

    const transRef = collection(db, "transactions");
    const cardRef = collection(db, "card_details");

    // Get all transactions for the user (without orderBy to avoid index requirement)
    const transQuery = query(
      transRef, 
      where("user_id", "==", user_id)
    );
    
    const transSnapshot = await getDocs(transQuery);
    let transactions = transSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at ? data.created_at.toDate().toISOString() : new Date().toISOString()
      };
    });

    // Sort transactions by created_at in JavaScript instead of Firestore
    transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    console.log(`Found ${transactions.length} transactions for user ${user_id}`);

    // Get user's cards for additional context
    const cardQuery = query(cardRef, where("user_id", "==", user_id));
    const cardSnapshot = await getDocs(cardQuery);
    const cards = cardSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`Found ${cards.length} cards for user ${user_id}`);

    // Calculate insights
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Filter transactions by time periods
    const thisMonthTransactions = transactions.filter(t => {
      const transDate = new Date(t.created_at);
      return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    });

    const lastMonthTransactions = transactions.filter(t => {
      const transDate = new Date(t.created_at);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return transDate.getMonth() === lastMonth && transDate.getFullYear() === lastMonthYear;
    });

    // Calculate totals - handle credit/debit transaction types
    const totalIncome = transactions
      .filter(t => {
        const transactionType = t.type?.toLowerCase();
        return transactionType === 'credit' || 
               (t.transaction_name && t.transaction_name.toLowerCase().includes('salary'));
      })
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const totalExpenses = transactions
      .filter(t => {
        const transactionType = t.type?.toLowerCase();
        return transactionType === 'debit' || 
               !transactionType || // default to expense if type not found
               (transactionType !== 'credit' && !t.transaction_name?.toLowerCase().includes('salary'));
      })
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const thisMonthExpenses = thisMonthTransactions
      .filter(t => {
        const transactionType = t.type?.toLowerCase();
        return transactionType === 'debit' || 
               !transactionType || // default to expense if type not found
               (transactionType !== 'credit' && !t.transaction_name?.toLowerCase().includes('salary'));
      })
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter(t => {
        const transactionType = t.type?.toLowerCase();
        return transactionType === 'debit' || 
               !transactionType || // default to expense if type not found
               (transactionType !== 'credit' && !t.transaction_name?.toLowerCase().includes('salary'));
      })
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    // Calculate month-over-month change
    const expenseChange = lastMonthExpenses > 0 
      ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    // Category breakdown (using transaction names as categories)
    const categoryTotals = {};
    transactions.forEach(transaction => {
      const amount = Math.abs(Number(transaction.amount) || 0);
      const transactionType = transaction.type?.toLowerCase();
      const isExpense = transactionType === 'debit' || 
                       !transactionType || // default to expense if type not found
                       (transactionType !== 'credit' && !transaction.transaction_name?.toLowerCase().includes('salary'));
      
      if (isExpense && amount > 0) {
        const category = categorizeTransaction(transaction.transaction_name);
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    });

    // Monthly spending trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const monthTransactions = transactions.filter(t => {
        const transDate = new Date(t.created_at);
        return transDate.getMonth() === targetDate.getMonth() && 
               transDate.getFullYear() === targetDate.getFullYear();
      });
      
      const monthExpenses = monthTransactions
        .filter(t => {
          const transactionType = t.type?.toLowerCase();
          return transactionType === 'debit' || 
                 !transactionType || // default to expense if type not found
                 (transactionType !== 'credit' && !t.transaction_name?.toLowerCase().includes('salary'));
        })
        .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

      const monthIncome = monthTransactions
        .filter(t => {
          const transactionType = t.type?.toLowerCase();
          return transactionType === 'credit' || 
                 (t.transaction_name && t.transaction_name.toLowerCase().includes('salary'));
        })
        .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

      monthlyTrend.push({
        month: targetDate.toLocaleDateString('en-US', { month: 'short' }),
        expenses: monthExpenses,
        income: monthIncome,
        net: monthIncome - monthExpenses
      });
    }

    // Recent transactions (enhanced with categories)
    const enhancedTransactions = transactions.slice(0, 50).map(transaction => {
      const amount = Math.abs(Number(transaction.amount) || 0);
      const originalAmount = Number(transaction.amount) || 0;
      const transactionType = transaction.type?.toLowerCase();
      
      // Determine transaction type: credit = income, debit = expense, default = expense
      let type = 'expense'; // default to expense
      if (transactionType === 'credit') {
        type = 'income';
      } else if (transactionType === 'debit') {
        type = 'expense';
      } else if (!transactionType) {
        // If no type is specified, default to expense
        type = 'expense';
      }
      
      // Special case: salary transactions should always be income regardless of type
      if (transaction.transaction_name?.toLowerCase().includes('salary')) {
        type = 'income';
      }
      
      return {
        ...transaction,
        category: categorizeTransaction(transaction.transaction_name),
        type: type,
        amount: amount,
        originalAmount: originalAmount,
        originalType: transaction.type || 'debit' // preserve original type, default to 'debit'
      };
    });

    const insights = {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      expenseChange,
      categoryTotals,
      monthlyTrend,
      transactionCount: transactions.length,
      averageTransactionAmount: transactions.length > 0 
        ? transactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) / transactions.length 
        : 0
    };

    return new Response(JSON.stringify({
      transactions: enhancedTransactions,
      insights,
      cards
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (err) {
    console.error("GET /api/transactions/insights error:", err);
    return new Response(JSON.stringify({ 
      error: "Internal server error", 
      details: err.message 
    }), {
      status: 500,
    });
  }
}

// Helper function to categorize transactions based on transaction name
function categorizeTransaction(transactionName) {
  const name = transactionName?.toLowerCase() || '';
  
  if (name.includes('grocery') || name.includes('supermarket') || name.includes('walmart') || name.includes('store')) {
    return 'Shopping';
  } else if (name.includes('coffee') || name.includes('restaurant') || name.includes('food') || name.includes('starbucks') || name.includes('mcdonald')) {
    return 'Food';
  } else if (name.includes('gas') || name.includes('fuel') || name.includes('transport') || name.includes('uber') || name.includes('taxi')) {
    return 'Transport';
  } else if (name.includes('rent') || name.includes('mortgage') || name.includes('housing') || name.includes('apartment')) {
    return 'Housing';
  } else if (name.includes('phone') || name.includes('electric') || name.includes('utility') || name.includes('internet') || name.includes('water')) {
    return 'Utilities';
  } else if (name.includes('salary') || name.includes('income') || name.includes('payroll') || name.includes('bonus')) {
    return 'Income';
  } else if (name.includes('entertainment') || name.includes('movie') || name.includes('gaming') || name.includes('netflix')) {
    return 'Entertainment';
  } else if (name.includes('medical') || name.includes('health') || name.includes('pharmacy') || name.includes('doctor')) {
    return 'Healthcare';
  } else {
    return 'Other';
  }
}
