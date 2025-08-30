"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnterDetailsPage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleProceed = (e) => {
    e.preventDefault();
    if (!recipient || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid recipient address and amount.");
      return;
    }
    // Pass details to transaction page via query params
    router.push(
      `/transaction?recipient=${encodeURIComponent(
        recipient
      )}&amount=${encodeURIComponent(amount)}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleProceed}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-black text-center">
          Enter Payment Details
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black bg-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-1">
            Amount (BDAG)
          </label>
          <input
            type="number"
            min="0.000000000000000001"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to transfer"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black bg-white"
          />
        </div>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-md text-white font-medium bg-green-600 hover:bg-green-700 transition-colors">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}
