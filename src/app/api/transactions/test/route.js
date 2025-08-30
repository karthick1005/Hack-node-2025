import { db } from "../../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

// Simple test endpoint to check if transactions can be fetched
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    console.log('Test endpoint - Fetching transactions for user_id:', user_id);

    if (!user_id) {
      return new Response(JSON.stringify({ 
        error: "Missing user_id",
        example: "Use ?user_id=your-user-id"
      }), {
        status: 400,
      });
    }

    const transRef = collection(db, "transactions");

    // Simple query without ordering
    const transQuery = query(transRef, where("user_id", "==", user_id));
    const transSnapshot = await getDocs(transQuery);
    
    const transactions = transSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at ? doc.data().created_at.toDate().toISOString() : null
    }));

    console.log(`Found ${transactions.length} transactions`);

    return new Response(JSON.stringify({
      success: true,
      count: transactions.length,
      user_id: user_id,
      transactions: transactions.slice(0, 10), // Return first 10 for testing
      sample_transaction: transactions[0] || null
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (err) {
    console.error("GET /api/transactions/test error:", err);
    return new Response(JSON.stringify({ 
      error: "Internal server error", 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }), {
      status: 500,
    });
  }
}
