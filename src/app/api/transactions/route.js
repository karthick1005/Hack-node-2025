import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc
} from "firebase/firestore";

// 🔹 Add a transaction
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      card_id,
      user_id,
      transaction_name,
      description, // ✅ New field
      address,     // ✅ New field
      status,
      amount,
      type,
      // Removed blockchain fields: blockchain_hash, recipient_address, network
    } = body;

    if (!card_id || !user_id || !transaction_name || amount == null) {
      return new Response(JSON.stringify({ error: "Missing required fields: card_id, user_id, transaction_name, amount" }), { 
        status: 400 
      });
    }

    // 🔹 Validate user exists (optional validation)
    let userData = null;
    try {
      const userDoc = await getDoc(doc(db, "users", user_id));
      if (userDoc.exists()) {
        userData = userDoc.data();
      }
    } catch (userError) {
      console.error("Error fetching user data:", userError);
    }

    // 🔹 Validate card exists and belongs to user (optional validation)
    let cardData = null;
    try {
      const cardDoc = await getDoc(doc(db, "card-details", card_id));
      if (cardDoc.exists()) {
        cardData = cardDoc.data();
        console.log("Card found:", cardData.card_name, "for user:", cardData.user_id);
        
        // Verify card belongs to user
        if (cardData.user_id !== user_id) {
          console.warn("Card ownership mismatch:", { card_user: cardData.user_id, request_user: user_id });
          return new Response(JSON.stringify({ error: "Card does not belong to this user" }), { 
            status: 403 
          });
        }
      } else {
        console.warn("Card not found with ID:", card_id);
        // Still proceed with transaction but with default values
      }
    } catch (cardError) {
      console.error("Error fetching card data:", cardError);
      // Still proceed with transaction but with default values
    }

    const transRef = collection(db, "transactions");

    // 🔹 Create simplified transaction document
    const transactionData = {
      card_id,
      user_id,
      transaction_name,
      description: description || "", // Default to empty string if not provided
      address: address || "",         // Default to empty string if not provided
      status: !!status,
      amount: Number(amount),
      type: type || "debit",         // Default to "debit" if not provided
      created_at: Timestamp.now(),
      
      // Removed blockchain fields: blockchain_hash, recipient_address, network
      
      // 🔹 Enhanced fields from user and card data
      userName: userData?.name || userData?.userName || userData?.displayName || "Unknown User",
      userEmail: userData?.email || null,
      cardName: cardData?.card_name || "Unknown Card",
      cardType: cardData?.card_type || "Unknown",
      
      // 🔹 Transaction metadata
      originalAmount: Number(amount),
      originalType: type === "credit" ? "credit" : "debit",
      category: type === "credit" ? "Income" : "Expense",
      
      // 🔹 Location data
      location: address || cardData?.location?.[0] || "Unknown Location",
      
      // 🔹 Timestamps
      updated_at: Timestamp.now(),
    };

    const docRef = await addDoc(transRef, transactionData);

    await updateDoc(doc(db, "transactions", docRef.id), {
      transaction_id: docRef.id,
    });

    // 🔹 Update card usage analytics
    if (cardData) {
      try {
        const newUsageCount = (cardData.card_usage_count || 0) + 1;
        const newBalance = type === "credit" 
          ? (cardData.balance || 0) + Number(amount)
          : (cardData.balance || 0) - Number(amount);

        await updateDoc(doc(db, "card-details", card_id), {
          card_usage_count: newUsageCount,
          lastUsageTime: Timestamp.now(),
          balance: Math.max(0, newBalance), // Ensure balance doesn't go negative
          
          // 🔹 Enhanced analytics
          last_transaction_amount: Number(amount),
          last_transaction_type: type,
          last_transaction_description: description || transaction_name,
          // Removed: last_transaction_hash: blockchain_hash,
          updated_at: Timestamp.now()
        });
      } catch (cardUpdateError) {
        console.error("Error updating card analytics:", cardUpdateError);
        // Don't fail the transaction if card update fails
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      id: docRef.id,
      transaction: {
        ...transactionData,
        transaction_id: docRef.id
      }
    }), {
      status: 201,
    });
  } catch (err) {
    console.error("POST /api/transactions error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

// 🔹 Get all transactions for a user or card
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const card_id = searchParams.get("card_id");

    if (!user_id && !card_id) {
      return new Response(JSON.stringify({ error: "Missing user_id or card_id" }), {
        status: 400,
      });
    }

    const transRef = collection(db, "transactions");

    const q = card_id
      ? query(transRef, where("card_id", "==", card_id))
      : query(transRef, where("user_id", "==", user_id));

    const snapshot = await getDocs(q);

    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (err) {
    console.error("GET /api/transactions error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
