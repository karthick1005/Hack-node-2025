// src/app/api/card-details/by-id/route.js
import { db } from "../../../../lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const card_id = searchParams.get("card_id");

    console.log("GET request for card_id:", card_id);

    if (!card_id) {
      return new Response(JSON.stringify({ error: "Missing card_id" }), {
        status: 400,
      });
    }

    const docRef = doc(db, "card_details", card_id);
    console.log("Fetching document:", card_id);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Document not found:", card_id);
      return new Response(JSON.stringify({ error: "Card not found" }), {
        status: 404,
      });
    }

    const cardData = { id: docSnap.id, ...docSnap.data() };
    console.log("Card data retrieved:", cardData);

    return new Response(JSON.stringify(cardData), {
      status: 200,
    });
  } catch (err) {
    console.error("GET /api/card-details/by-id error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const card_id = searchParams.get("card_id");

    console.log("PUT request for card_id:", card_id);

    if (!card_id) {
      return new Response(JSON.stringify({ error: "Missing card_id" }), {
        status: 400,
      });
    }

    const body = await req.json();
    console.log("PUT request body:", body);

    const updateData = {};

    // Only allow updating specific usage-related fields
    if (body.card_usage_count !== undefined) {
      updateData.card_usage_count = body.card_usage_count;
      console.log("Updating card_usage_count to:", body.card_usage_count);
    }

    if (body.lastUsageTime !== undefined) {
      updateData.lastUsageTime = Timestamp.fromDate(new Date(body.lastUsageTime));
      console.log("Updating lastUsageTime to:", body.lastUsageTime);
    }

    if (body.balance !== undefined) {
      updateData.balance = body.balance;
      console.log("Updating balance to:", body.balance);
    }

    console.log("Update data:", updateData);

    const docRef = doc(db, "card_details", card_id);
    console.log("Updating document:", card_id);

    await updateDoc(docRef, updateData);

    console.log("Document updated successfully");

    return new Response(JSON.stringify({ success: true, message: "Card updated successfully" }), {
      status: 200,
    });
  } catch (err) {
    console.error("PUT /api/card-details/by-id error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
