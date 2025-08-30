"use client";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";
import { useEffect, useState } from "react";
const Page = () => {
    const {user } = useAuthStore();
    const [cards, setCards] = useState([]);
    const newCard = {
    user_id: user?.uid,
    userName: "Mukesh",
    card_type: "Credit",
    card_name: "SBI smart credit Card",
    card_status: true,
    card_description: "Gain more rewards with SBI smart card",
    balance: 10000,
    card_number: "1234-5678-9012-3456",
    lastUsageTime: new Date().toISOString(),
    expiryDate: new Date(2027, 3, 30).toISOString(),
    pin: 1234,
    location: ["Chennai", "Coimbatore"],
    card_usage_count: 12,
    location_track: true,
    transaction_alert: true,
  };
    const addCard = async () => {
    try {
      const res = await api.post("/card-details", newCard);
      if (res.data.success) {
        alert("Card added!");
        fetchCards(); // reload cards
      }
    } catch (err) {
      console.error("Add card error:", err);
    }
  };

  const fetchCards = async () => {
    try {
      const res = await api.get(`/card-details?user_id=${user?.uid}`);
      setCards(res.data);
    } catch (err) {
      console.error("Fetch cards error:", err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user?.uid]);

  console.log("New Card Data:", newCard);
  return (
       <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Your Cards</h2>
      <button
        onClick={addCard}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Card
      </button>

      {cards.length === 0 ? (
        <p>No cards found.</p>
      ) : (
        <ul className="space-y-2">
          {cards.map(card => (
            <li key={card.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{card.card_name}</h3>
              <p>Name: {card.userName}</p>
              <p>Balance: ₹{card.balance}</p>
              <p>Type: {card.card_type}</p>
              <p>Status: {card.card_status ? "Active" : "Inactive"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>

  )
}

export default Page