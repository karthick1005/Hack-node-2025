"use client";
import React from "react";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";

const CardDisplay = ({ cardData }) => {
  if (!cardData) return null;
  const isValidDate = (dateStr) => {
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d);
  };

  const formattedDate = isValidDate(cardData.lastUsed)
    ? format(new Date(cardData.lastUsed), "dd/MM/yyyy")
    : "N/A"; // fallback if invalid
  return (
    <div className="bg-white rounded-2xl shadow-md border p-6 max-w-md w-full mx-auto">
      {/* Card Visual */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-xs opacity-70 mb-1">Card Type</div>
            <div className="text-sm font-semibold">{cardData.card_type}</div>
          </div>
          <div className="bg-white bg-opacity-20 p-1 rounded">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs opacity-70 mb-1">Card Number</div>
          <div className="text-lg font-mono tracking-widest">
            {cardData.card_number}
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <div className="text-xs opacity-70 mb-1">Valid Thru</div>
            <div className="text-sm">
              {cardData.expiryDate && !isNaN(new Date(cardData.expiryDate))
                ? format(new Date(cardData.expiryDate), "MM/yy")
                : "N/A"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-70 mb-1">Status</div>
            <div className="text-sm">
              {cardData.card_status ? "✅ Active" : "❌ Inactive"}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white border-opacity-30">
          <div className="text-sm font-semibold">{cardData.userName}</div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-5 space-y-4 text-gray-800">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Balance</div>
            <div className="text-sm font-bold">₹{cardData.balance}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Usage Count</div>
            <div className="text-sm font-bold">{cardData.card_usage_count}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Card Name</div>
          <div className="text-sm">{cardData.card_name}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Description</div>
          <div className="text-sm">{cardData.card_description}</div>
        </div>

        <div>
          {cardData.lastUsed ? (
            <div className="text-sm text-gray-700">
              Last Used:{" "}
              {cardData.lastUsed && !isNaN(new Date(cardData.lastUsed))
                ? format(new Date(cardData.lastUsed), "dd/MM/yyyy")
                : "No usage data"}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No usage data</div>
          )}
        </div>

        <div>
          <div className="text-xs text-gray-500">Locations</div>
          <div className="text-sm">
            {cardData.location?.join(", ") || "N/A"}
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
          <div>
            PIN:{" "}
            <span className="text-black font-semibold">{cardData.pin}</span>
          </div>
          <div>
            Alert:{" "}
            <span className="text-black font-semibold">
              {cardData.transaction_alert ? "On" : "Off"}
            </span>
          </div>
          <div>
            Track:{" "}
            <span className="text-black font-semibold">
              {cardData.location_track ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
