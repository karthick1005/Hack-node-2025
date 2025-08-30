import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      user_id,
      userName,
      card_type,
      card_name,
      card_status,
      card_description,
      balance,
      card_number,
      lastUsageTime,
      expiryDate,
      pin,
      location,
      card_usage_count,
      location_track,
      transaction_alert,
    } = body;

    if (!user_id || !card_number) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    const cardRef = collection(db, "card_details");
const docRef = await addDoc(cardRef, {
  user_id,
  userName,
  card_type,
  card_name,
  card_status,
  card_description,
  balance,
  card_number,
  lastUsageTime: lastUsageTime ? Timestamp.fromDate(new Date(lastUsageTime)) : Timestamp.now(),
  expiryDate: expiryDate ? Timestamp.fromDate(new Date(expiryDate)) : null,
  pin: pin ?? 0,
  location: Array.isArray(location) ? location : [],
  card_usage_count: card_usage_count ?? 0,
  location_track: !!location_track,
  transaction_alert: !!transaction_alert,
  created_at: Timestamp.now(),
});

// ✅ This works now
await updateDoc(docRef, {
  card_id: docRef.id,
});
    return new Response(JSON.stringify({ success: true, id: docRef.id }), {
      status: 201,
    });
  } catch (err) {
    console.error("POST /api/card-details error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}


// Get cards for a specific user_id
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
      });
    }

    const cardsRef = collection(db, "card_details");
    const q = query(cardsRef, where("user_id", "==", user_id));
    const snapshot = await getDocs(q);

    const cards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(cards), { status: 200 });
  } catch (err) {
    console.error("GET /api/card-details error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
